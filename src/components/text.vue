<template>
  <div class="card" >
    <el-card class="box-card" :body-style="bodystyle" >
      <router-link :to="{path:'detail',query:{uuid:item.uuid,alias:item.alias}}" v-if="productMachine" >
        <!-- 机器状态 WHstatus_ExecState-->
        <div class="stat" v-for="(it,indexs) in arr" :key="indexs">
          <div v-if="cilcle(it,item)">
            <span v-if="running(it)" :style="{background:'green',color:'#fff'}" v-show="show"></span>
            <span v-else-if="it.value=='Idle'&&it.status=='WHstatus_ExecState'" :style="{background:'#FFD900'}" v-show="show"></span>
            <span v-else-if="it.value=='Estop'&&it.status=='WHstatus_ExecState'" :style="{background:'red',color:'#fff'}" v-show="show"></span>
            <span v-else-if="it.status=='WHstatus_ExecState'" :style="{background:'gray',color:'#fff'}" v-show="show"></span>
          </div>
        </div>  
        <!-- 设备监控 -->
        <div v-if="show">
          <p class="card-alias-name">{{item.alias}}</p>
          <div class="uuid" >{{item.uuid}}</div>
          <div class="pres" v-show="show" @click="getParamList(item)" >{{ $sl(item.item, item) }}</div>
          <div class="val" v-for="(it,indexs) in process" v-if="it.uuid==item.uuid" :key="indexs" v-text:msg="textVal(it)">{{msg}}</div>
        </div>
        </router-link>
        <div v-else-if="show&&all">
            <p class="card-alias-name">{{item.alias}}</p>
            <div class="uuid" >{{item.uuid}}</div>
            <div class="pres all" v-show="show" @click="getParamList(item)" >{{$sl(item.param)}}</div>
            <i class="star" :class="item.enable ? 'el-icon-star-on' : 'el-icon-star-off'" @click="foucsClick(item,index)" ></i> 
            <i class="el-icon-remove" v-show="icon" @click="removeCard(item)"></i>
            <div class="val" v-for="(it,indexs) in process" v-if="it.uuid==item.uuid" :key="indexs" v-text:msg="textVal(it)">{{msg}}</div>
        </div>
        <!-- 详情页的参数数据显示 -->
        <div v-show="!show" >
          <div class="pres" >{{ !WHstatus_ExecState ?   $sl(item.status) : '' }}</div>
          <el-progress  :text-inside="true" :stroke-width="18" v-if="item.status=='WHstatus_HadCompletedPercent'" :percentage="Number(item.value)"></el-progress>
          <div class="val" v-show="!echart" v-if="!WHstatus_ExecState">{{textVal(item)}}</div>
          <i v-if="item.status == 'WHstatus_FeedV' " class="el-icon-zoom-in" @click="feedv(item)"></i>
          <i class="el-icon-remove" v-show="icon" v-if="item.status!=='WHstatus_ExecState'" @click="removeCard(item)"></i>
        </div>
        <div v-if="WHstatus_ExecState&&WHstatus_ExecState.status == 'WHstatus_ExecState'">
          <div v-show="!echart" class="state" v-bind:style="{backgroundColor:bgcolor,color:color}" v-if="ExecState">{{state}}</div>
          <div v-show="!echart" class="val">{{ $t("message.stime") }}:{{item.time.split("T").join(" ")}}</div>
        </div>
        <div v-else-if="WHstatus_ExecState&&WHstatus_ExecState.status == 'WHstatus_Timeline'? true : false">
          <div class="pres">{{lang=='English' ? "Run Log" : "运行日志"}}</div>
          <div class="log">
            <div class="first"></div>
            <div class="second"></div>
            <div class="third"></div>
            <div class="fourth" v-html="timelineStyle">
              {{timelineStyle}}
            </div>
          </div>
          <div class="container_s">
            <div class="first_div">0:00</div>
            <div class="second_div">8:00</div>
            <div class="third_div">16:00</div>
            <div class="fouth_div">24:00</div>
          </div>
        </div>
        <div v-else-if="WHstatus_ExecState&&WHstatus_ExecState.status == 'WHstatus_Efficiency'? true : false">
          <echart :option="setOptions(item)"  :id="item.status"></echart>
        </div>
        <div v-else-if="WHstatus_ExecState&&WHstatus_ExecState.status == 'WHstatus_Efficiency_yester'? true : false">
          <echart :option="setOptions(item)"  :id="item.status"></echart>
        </div>
        <div v-else-if="warning" class="mesWarn">
          <div class="pres">{{ $t('message.info_alarm') }}</div>
          <div class="alarm" v-for="(item,index) in wh_error" :key="index">{{item.value}} <span v-if="item">[{{item.time.split("T").join(" ").slice(0,19)}}]</span></div>
          
        </div>
        <div>
        </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
@import "../style/card.scss";
</style>

<script type="text/javascript">
import { mapState } from "vuex";
import echart from "./echart.vue";
import Cookies from "js-cookie";
export default {
  props: [
    "mqtuuid",
    "item",
    "index",
    "lang",
    "process",
    "allMqttStatus",
    "WHstatus_ExecState",
    "icon",
    "euuid",
    "all",
    "selected",
    "collect",
    "bodystyle"
  ],
  data() {
    return {
      msg: "",
      arr: [],
      show: true,
      bgcolor: "",
      color:'#333',
      state: "",
      runData: [],
      echart: false,
      wh_error: [],
      line: "",
      allshow: false,
      ExecStateState: this.WHstatus_ExecState
    };
  },
  mounted() {
    if (this.allMqttStatus) {
      //如果是设备详情8个设备参数
      this.arr = this.allMqttStatus;
      //生产监控里的页面
      this.show = false;
      this.allshow = false;
      //删除icon
    } else if (this.mqtuuid) {
      //当传来的是生产监控页面时的
      this.arr = this.mqtuuid;
      this.show = true;
      this.allshow = false;
    } else if (this.WHstatus_ExecState) {
      //echarts图表里的参数
      this.show = false;
      this.allshow = false;
    } else if (this.all) {
      //所有设备
      this.arr = this.all;
      this.show = true;
      this.allshow = true;
    }
  },
  components: {
    echart
  },
  computed: {
    ...mapState(["aliasMqtt"]),

    filterArr: function() {
      this.arr.filter(t => {
        if (t.status == this.item.status) {
          return true;
        }
      });
    },
    noclick: function() {
      if (this.all) {
        return "pointer-events: none;";
      }
    },
    productMachine() {
      if (this.show == true && this.allshow == false) {
        return true;
      } else {
        return false;
      }
    },
    timelineStyle() {
      let values = this.timeLineMethods(this.item);
      var machine_width = 335;
      var html = "";
      for (var i = 0; i < values.length; i++) {
        var sIndex = values[i].time / (24 * 60 * 60) * machine_width;
        var sL = values[i]._timeStamp / (24 * 60 * 60) * machine_width;
        var sColor = this.getcolor(values[i]._value);
        html +=
          "<div class='time_line_item'  style='background:" +
          sColor +
          ";height: 14px;position:absolute;top:0;left:" +
          sIndex +
          "px;width:" +
          sL +
          "px;'>" +
          "</div>";
      }
      return html;
    },
    warning() {
      if (
        this.WHstatus_ExecState &&
        this.WHstatus_ExecState.status == "WHstatus_Error"
      ) {
        let that = this;
        let arr = [];
        this.allMqttStatus.forEach(function(val) {
          if (val.uuid == that.euuid) {
            val.data.forEach(function(data) {
              if (data.status == "WHstatus_Warning") {
                let obj = {
                  value: data.value,
                  time: data.time
                };
                arr.push(obj);
              } else if (data.status == "WHstatus_Error") {
                let obj = {
                  value: data.value,
                  time: data.time
                };
                arr.push(obj);
              }
            });
          }
        });
        let set = new Set(arr);
        this.wh_error = Array.from(set);
        return true;
      }
    },
    ExecState: function() {
      if (
        this.WHstatus_ExecState &&
        this.WHstatus_ExecState.status == "WHstatus_ExecState"
      ) {
        if (this.WHstatus_ExecState.value == "Running") {
          this.state = this.$t('message.running');
          this.bgcolor = "green";
          this.color = "#fff";
        } else if (this.WHstatus_ExecState.value == "Idle") {
          this.state = this.$t('message.idle');
          this.bgcolor = "#FFD900";
          this.color = "#333";
        } else if (this.WHstatus_ExecState.value == "Estop") {
          this.state = this.$t('message.estop');
          this.bgcolor = "red";
          this.color = "#fff";
        } else {
          this.state = this.$t('message.offline');
          this.bgcolor = "gray";
          this.color = "#fff";
        }
        return true;
      } else if (
        this.WHstatus_ExecState &&
        this.item.status == "WHstatus_FeedV"
      ) {
        console.log(this.item);
        this.echart = true;
        this.setOption = {
          title: this.$t('message.today_working_hour_distribution')
        };
        return true;
      }
    }
  },
  methods: {

     /**
     * @method
     * @description get en name of status 
     */
    getEnByStatuName(name){
      return name.substring(name.indexOf('_')+1,name.length)
    },
    
    showCondition(it, item) {
      if (this.mqtuuid) {
        return it.uuid == item.uuid;
      } else if (this.allMqttStatus) {
        return (it.status = item.status);
      }
    },
    getParamList(res) {
      if (this.all) {
        this.$emit("chooseParam", res);
      }
    },
    feedv(val) {
      this.$emit("showFeedv", true);
    },
    cilcle: function(it, item) {
      console.log("*******************************************");
      console.log(it)
      if (this.mqtuuid && it.uuid == item.uuid && this.allshow == false) {
        return true;
      }
    },
    running(it) {
      var reg = /^[0-9]+.?[0-9]*$/;
      let result = reg.test(it.value);
      if (
        (it.value == "Running" && it.status == "WHstatus_ExecState") ||
        result
      ) {
        return true;
      }
    },
    feedVSstyle(msg) {
      var t = msg * 60 + " ";
      var t1 = t.indexOf(".");
      if (t1 == -1) {
        t1 = t.length;
      }
      var a = t.substr(0, t1);
      return a;
    },
    getcolor(execstatus) {
      var color = "gray";
      if (execstatus == "Running") {
        color = "#00BA00";
      } else if (execstatus == "Idle") {
        color = "#FFD900";
      } else if (execstatus == "Estop") {
        color = "#FF2609";
      }
      return color;
    },
    removeCard(rel) {
      this.$emit("remove", rel);
    },
    timeLineMethods(g_timeline) {
      var newObj = {
        value: []
      };
      var compare = function(obj1, Obj2) {
        var val1 = obj1._timeStamp;
        var val2 = Obj2._timeStamp;
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
      };
      //把当前的时间戳压进去,
      var current = new Date().getTime() + 8 * 60 * 60 * 1000;
      //然后转化为东八区，当前的时间;
      var currents = new Date(current).toISOString();
      currents = currents.substring(0, 19);
      var b = {
        _timeStamp: currents,
        _value: ""
      };
      g_timeline.value.push(b);
      var sortObj = g_timeline.value.sort(compare);
      //判断是否在同一天
      var data1 = g_timeline.value[0]._timeStamp.substring(0, 10);
      var data2 = g_timeline.value[
        g_timeline.value.length - 1
      ]._timeStamp.substring(0, 10);
      //让不在一天以内的时间，统一到在一天以内，删除那些不在一天以内的元素；
      for (var i = g_timeline.value.length - 1; i >= 0; i--) {
        if (data2 !== g_timeline.value[i]._timeStamp.substring(0, 10)) {
          var status = g_timeline.value[i]._value;
          g_timeline.value.splice(0, i + 1);
          var zero = data2 + "T" + "00:00:00";
          var a = {
            _timeStamp: zero,
            _value: status
          };
          g_timeline.value.unshift(a);
          break;
        }
        if (i == 0) {
          var zeros = data2 + "T" + "00:00:00";
          var b = {
            _timeStamp: zeros,
            _value: status
          };
          g_timeline.value.unshift(b);
        }
      }
      //==========================
      var time_diff1, time_diff2;
      //把数组的时间差放进数组对象里；
      for (var i = 0; i < g_timeline.value.length - 1; i++) {
        var _1 = g_timeline.value[i];
        var _2 = g_timeline.value[i + 1];
        time_diff1 = new Date(_1._timeStamp).getTime() / 1000;
        //获取数组的第一个时间的毫秒数；
        var obj0 = new Date(g_timeline.value[0]._timeStamp).getTime() / 1000;
        time_diff2 = new Date(_2._timeStamp).getTime() / 1000;
        var obj2 = {
          _timeStamp: time_diff2 - time_diff1,
          _value: _1._value,
          time: time_diff1 - obj0
        };
        newObj.value.push(obj2);
      }
      //动态生成=============================
      return newObj.value;
      newObj.value = [];
    },
    setOptions(item) {
      let obj = {};
      if (item.status == "WHstatus_Efficiency") {
        obj.title = this.$t('message.today_working_hour_distribution');
        obj.status = this.item.status;
      } else if (item.status == "WHstatus_Efficiency_yester") {
        obj.title = this.$t('message.yesterday_working_hours_distribution');
        obj.status = this.item.status;
      }
      let arr = [];
      let todayRemain = 0;
      if (item.value !== null && item.value) {
        for (var i = 0; i < item.value.length; i++) {
          if (item.status == "WHstatus_Efficiency") {
            todayRemain += item.value[i].time;
          }
          let o = {};
          if (item.value[i].status == "Running") {
            o.name = this.$t('message.running');
            o.value = item.value[i].time;
          } else if (item.value[i].status == "Estop") {
            o.name = this.$t('message.estop');
            o.value = item.value[i].time;
          } else if (item.value[i].status == "Idle") {
            o.name = this.$t('message.idle');
            o.value = item.value[i].time;
          } else if (item.value[i].status == "Offline") {
            o.name = this.$t('message.offline');
            o.value = item.value[i].time;
          }
          arr.push(o);
        }
      }
      if (todayRemain > 0) {
        let val = 24 * 3600 * 1000 - todayRemain;
        let o = {
          name: this.$t('message.remaining_time'),
          value: val
        };
        arr.push(o);
      }
      obj.type = "pie";
      obj.name = this.$t('message.machining_efficiency_analysis');
      obj.data = arr;
      return obj;
    },
    textVal(param) {
      let name = param.status;
      let value = param.value;
      let time = param.time || param.value;
      let val;
      if (name == "WHstatus_TotalCompletedCount") {
        val = value + this.$t('message.pieces');
      } else if (name == "WHstatus_ControllerMode") {
        val = value;
      } else if (name == "WHstatus_FeedV") {
        if (time) {
          val = this.feedVSstyle(value) + "  mm/min";
        }
      } else if (name == "WHstatus_SpindleFeedrate") {
        val = value + " %";
      } else if (name == "WHstatus_SpindleSpeed") {
        val = value + "  rpm";
      } else if (name == "WHstatus_FeedRate") {
        val = value + "  %";
      } else if (name == "WHstatus_HadCompletedPercent") {
        val = value + "  %";
      } else if (name == "WHstatus_programName") {
        if (value == "" || time.value == "") {
          val = "****";
        } else {
          //截取加工文件
          var cncname = value.substr(value.lastIndexOf("\\") + 1);
          val = cncname;
        }
      } else if (name == "WHstatus_ExecState") {
        if (value == "Running") {
          val = this.$t('message.running');
        } else if (value == "Idle") {
          val = this.$t('message.idle');
        } else if (value == "Estop") {
          val = this.$t('message.estop');
        } else {
        }
      } else if (name == "WHstatus_Timeline") {
      } else if (name == "WHstatus_Efficiency") {
        //echarts
        var todayTimeSum = 0;
        if (value !== null && value) {
        }
      } else if (name == "WHstatus_Error") {
      } else if (value == "" || time == "") {
        val = "****";
      } else if (name == "WHstatus_CutTime") {
        val = value + "ms";
      } else if (name == "WHstatus_Info") {
        val = value;
      } else if (name == "WHstatus_OilPumpUsedTime") {
        val = value;
      } else if (name == "WHstatus_SingleTime") {
        val = value;
      } else if (name == "WHstatus_FilterCartridgeUsedTime") {
        val = value;
      } else if (name == "WHstatus_RailOilUsedTime") {
        val = value;
      } else if (name == "WHstatus_HighPressureSealRingUsedTime") {
        val = value;
      } else if (name == "WHstatus_OilPressureSealRingUsedTime") {
        val = value;
      } else if (name == "WHstatus_HighPressureUsedTime") {
        val = value;
      } else if (name == "WHstatus_JewelNozzleUsedTime") {
        val = value;
      } else if (name == "WHstatus_TotalLength") {
        val = value;
      } else if (name == "WHstatus_TotalLength") {
        val = value;
      } else if (name == "WHstatus_CutLength") {
        val = value;
      } else if (name == "WHstatus_LinearAxisFeedrate") {
        val = value;
      } else if (name == "WHstatus_RevAxisFeedrate") {
        val = value;
      } else if (name == "WHstatus_HydraulicOilUsedTime") {
        val = value;
      } else if (name == "WHstatus_SandBlastingHoseUsedTime") {
        val = value;
      } else if (name == "WHstatus_ElpasedTime") {
        val = value;
      }
      return val;
    },
    /**@method
     * @description card 关注machine 点击
     * @param {Object} item machine状态数据
     * @param {Number} index 在数据数组中的index
     */
    foucsClick(item,index){
      this.collect(item,index);
    }
  },
  watch: {
    arr: function(value) {},
    WHstatus_ExecState: function(newValue) {},
    item: function(val) {
      
    },
    lang(val) {
      console.log(val);
    },
    all(val) {
      
    },
    process(val) {},
    mqtuuid: function(val) {},
    allMqttStatus: function(val) {}
  }
};
</script>

