<template>
  <div class="detail" ref="detail_container">
    <div class="tool">
      <el-form :inline="true"  class="demo-form-inline">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="(item,index) in machinelist"
              :key="index"
              :label="item.alias"
              :uuid="item.uuid"
              :command="item"
              :value="item.alias">
            </el-option>
          </el-select>
        <el-form-item> 
          <span style="color:#000">{{$t('message.setnum')}}</span>
          <el-select v-model="colnumSet" style="width:30%" placeholder="">
            <el-option v-for="i in intcolnum" :key=" 'set' + i" :value="i" ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="zaochen" v-show="zaochen" >
      <i class="el-icon-circle-close-outline" @click="hiddeFeedv"></i>
      <echart :option="lineFeedv" id="text" :parentStyle="feedvStyle"></echart>
    </div>
    <div class="card-content">
      <div class="card-content-wrap" ref="card_content_wrap"><card v-for="(item,index) in getEcharts" :key="index" :WHstatus_ExecState="item"  :allMqttStatus="allMqttStatus" :item="item" :icon="false" :euuid="uuid" :lang="lang"></card>
      <card v-for="(item,index) in innerCard" :key="index+allMqttStatus[0].data.length" :item="item"  :allMqttStatus="allMqttStatus" v-on:remove="removeCard" :icon="true" v-on:showFeedv="getFeedv" :lang="lang"></card>
      <el-card class="box-card"  @click="dialogVisible = true" :lang="lang">
        <el-button type="text"  @click="dialogVisible = true;add=true"><i class="el-icon-circle-plus" ></i></el-button>
      </el-card></div>
      
    </div>
    <el-dialog
      :title="$t('message.select_content_for_the_newly_added')"
      :visible.sync="dialogVisible"
      width="30%">
      <select v-model="selected" v-show="add">
        <option v-for="(item,index) in li" :key="index" :value="item">{{ $sl(item.key)  }}</option>
      </select>
      <div v-show="!add">{{ $t('message.make_sure_delete_parameter') }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t("message.cancel") }}</el-button>
        <el-button type="primary" @click="saveParam()" v-show="add">{{ $t("message.ok") }}</el-button>
        <el-button type="primary" @click="removeParam()" v-show="!add">{{ $t("message.ok") }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import '../style/detail.scss'
</style>

<script type="text/javascript">
import * as api from '../api/server.js';
import { mapMutations,mapState} from 'vuex';
import NcMqttClient from '../mqtt/mqttEchart.js';
import md5 from 'js-md5';
import echart from './echart.vue';
import card from './card.vue';
import Cookies from 'js-cookie'

  export default{
    props:["lang",'isexpand'],
    data(){
      return {
        mqttDetail:{},
        machinelist:[],
        innerText:[],
        machineParameterList:[],
        msg:'',
        proData:0,
        add:true,
        process:false,
        allMqttStatus:[],
        uuid:this.$route.query.uuid,
        mqtts:[],
        WHstatus:{},
        yester:{},
        innerCard:[],
        li:[],
        value:"",
        alias:'',
        title:'',
        zaochen:false,
        delete:{},
        selected:'',
        fail:"",
        feedv:[],
        dialogVisible: false,
        echartsMqtt:["WHstatus_ExecState","WHstatus_Timeline","WHstatus_Efficiency","WHstatus_Error"],
        feedvStyle:{},
        containerWidth:'',
        colnum : '',
        colnumSet : '',
        intcolnum : 0,
        numSet :'',
        cardWidth : 380,
        is_expand : this.isexpand
      }
    },
    components:{
      echart,
      card
    },
    computed:{
      getEcharts:function(){
        let arr = [];
        arr.push(this.yester);
        let that = this;
        this.allMqttStatus.filter(t => {
          if(t.uuid==that.uuid){
            let value = [];
            t.data.forEach(function(data){
              that.echartsMqtt.forEach(function(val){
                if(val==data.status){
                  arr.push(data)
                }
              })
            })
          }
        });
        return arr
      },
      lineFeedv(){
        let that = this;
        let data = [];
        this.feedv.forEach(function(val){
          if(val.uuid == that.uuid){
            if(val.data.length > 1800){
              val.data = val.data.slice(500)
            }
            val.data.forEach(function(dd){
              let arr = [];
              let ts = dd.time.substr(0,27);
              let value = that.feedVSstyle(dd.value);
              arr.push(ts);
              arr.push(value);
              data.push(arr)
            })
          }
        })
        return {
            type:"line",
            data:data
        }
      },
      computStyle(){
        let width = window.screen.width*0.85 + "px";
        let height = "80vh";
        return {
            width:width,
            height:height
        }
      }
    },
    methods:{
      ...mapMutations(['CHANGEALIAS']),
      handleCommand(command) {
          console.log(command)
        this.uuid = command.uuid;
        this.alias = command.alias;
        this.yesterEffi();
        this.title = command.alias;
        this.$emit("title",command.alias)
      },
      removeCard(value){
        this.dialogVisible = true;
        this.add = false;
        this.delete = value;
      },
      warning(res) {
        this.$alert(res, this.$t('message.tip'), {
          confirmButtonText: this.$t('message.ok'),
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${ action }`
            });
          }
        });
      },
      removeParam(){
        let value = {
          val:this.delete.status,
          uuid:this.uuid
        }
        let that = this;
        api.rmParameter(value)
          .then(function(rel){
            if(rel.data.result=="success"){
              that.dialogVisible = false;
              that.getMachineData({uuid:that.uuid});
              that.allmachinedropList({uuid:that.uuid})
            }
          })
      },
      getFeedv(val){
        if(val){
          this.zaochen = true;
        }
      },
      hiddeFeedv(){
        this.zaochen = false;
      }, 
      saveParam(){
        this.dialogVisible = false;
        let value = {
          val:this.selected,
          uuid:this.uuid
        }
        let val = this.selected;
        let that = this;
        if(val!==""){
          api.creatSaveMachineParameter(value)
            .then(function(rel){
              if(rel.data.result == "success"){
                that.getMachineData({uuid:that.uuid});
                that.allmachinedropList({uuid:that.uuid})
              }
            })
          }
      },
      feedVSstyle(msg){
        var t = msg * 60 + " ";
        var t1 = t.indexOf('.');
        if(t1 == -1) {
          t1 = t.length;
        }
        var a = t.substr(0, t1);
        return a;
      },
      rule(param){
        let name = param.status;
        let value = param.value;
        let time = param.time;
        let val;
        if(name == "WHstatus_TotalCompletedCount") {
          val = value + +" " +this.$t('message.pieces');
        } else if(name == "WHstatus_ControllerMode") {
          val = value;
        } else if(name == "WHstatus_FeedV") {
          
          val =  value + "  mm/min";
        } else if(name == "WHstatus_SpindleFeedrate") {
          val = value + " %";
        } else if(name == "WHstatus_SpindleSpeed") {
          val = value + "  rpm";
        } else if(name == "WHstatus_FeedRate") {
          val = value + "  %";
        } else if(name == "WHstatus_HadCompletedPercent") {
          val = value + "  %";
        } else if(name == "WHstatus_programName") {
          if(value == '') {
            val = '****';
          } else {
            //截取加工文件
            var cncname = value.substr(value.lastIndexOf('\\') + 1);
            val = cncname;
          }
        } else if(name == "WHstatus_ExecState") {
          
          if(value == "Running") {
            
          } else if(value == "Idle") {
           
          } else if(value == "Estop") {
           
          } else {
            
          }
        } else if(name == "WHstatus_Timeline") {
         
        } else if(name == 'WHstatus_Efficiency') {
          //echarts
          var todayTimeSum = 0;
          if(value !== null &&value) {
            
          }
        } else if(name == 'WHstatus_Error') {}
        return val
      },
      yesterEffi(){
        let obj = {
          uuid:this.uuid ? this.uuid : this.$route.query.uuid
        };
        api.yesterdayEfficiency(obj)
          .then(res =>{
            if(res.data.result=="success"&&res.data.value!==null){
              let o = {
                uuid:res.data.value.uuid,
                status:"WHstatus_Efficiency_yester",
                value:res.data.value.duration
              }
              this.yester = o;
            }else{
            //没有数据的情况；
              let val = [{status:"Estop",time:0},{status:"Idle",time:0},{status:"Running",time:0},{status:"Offline",time:1}]
              this.yester = {
                uuid:this.uuid ? this.uuid : this.$route.query.uuid,
                status:"WHstatus_Efficiency_yester",
                value:val
              };
            }
          })
      },
      paramSelect(value){
      },
      detailMqtt(uuid){
        let pass = md5("ly1024");
        let ar = [];
        var _this = this;
        var detailMqtt = new NcMqttClient(Cookies.get("username"), Cookies.get("password"), function(_1, _2, _3, _4) {
            ar = [_1, _2, _3, _4];
              for(var i=0;i<_this.machineParameterList.length;i++){
                if(ar[1]==_this.machineParameterList[i].key){

                  if(_this.innerText.length==0){
                  //如果innerText里面是空
                    let param = {};
                    param.uuid = ar[0];
                    param.data = [];
                    let obj = {
                      status:ar[1],
                      value:ar[2],
                      time:ar[3],
                      alias:_this.machineParameterList[i].value
                    }
                    param.data.push(obj);
                    _this.innerText.push(param); 
                  }else{
                    let flag = true;
                    _this.innerText.forEach(function(val){
                      let flagid = true;
                      if(val.uuid==ar[0]){
                      //判断里面是否有uuid相同的情况
                        flagid = false;
                        flag = false;
                        let flagData = true;
                        let newDataObj = {};
                        let newDataArr = [];
                        val.data.forEach(function(three){
                          if(three.status==ar[1]){
                          //判断status是相同就直接将里面对象替换并放到个新的数组里面
                            flagData = false;
                            newDataObj.status = ar[1];
                            newDataObj.value = ar[2];
                            newDataObj.time = ar[3];
                            newDataObj.alias = _this.machineParameterList[i].value;
                            newDataArr.push(newDataObj)
                          }else{
                          //不同就直接放到新的数组里面,该uuid下新的data数组
                            newDataArr.push(three);
                          }
                        });
                        if(flagData){
                        //该uuid下没有这个status,将uuid的data里push个新对象
                          let o = {
                            status:ar[1],
                            value:ar[2],
                            time:ar[3],
                            alias:_this.machineParameterList[i].value
                          }
                          _this.innerText.forEach(function(one){
                            if(one.uuid==val.uuid){
                              one.data.push(o)
                            }
                          })
                        }else{
                        //该uuid下有status，将uuid的data付值为newDataArr;
                         _this.innerText.forEach(function(two){
                            if(two.uuid==val.uuid){
                              two.data = newDataArr;
                            }
                          })
                        }
                      }
                    });
                    if(flag){
                    //如果没有这个uuid的对象
                      let param = {};
                      param.uuid = ar[0];
                      param.data = [];
                      let newObj = {};
                      newObj.status = ar[1];
                      newObj.value = ar[2];
                      newObj.time = ar[3];
                      newObj.alias = _this.machineParameterList[i].value;
                      param.data.push(newObj);
                      _this.innerText.push(param);
                    }
                  }       
                }
              };

              _this.addParam(_this.machineParameterList)
              _this.innerText.forEach(function(o){
                if(o.uuid==_this.uuid){
                  _this.innerCard = o.data;
                }
              })
              //生成allMqttStatus数组
              if(_this.allMqttStatus.length==0){
                let param = {};
                param.uuid = ar[0];
                param.data = [];
                let obj = {
                  status:ar[1],
                  value:ar[2],
                  time:ar[3],
                }
                param.data.push(obj);
                _this.allMqttStatus.push(param);
              }else{
                    let flag = true;
                    _this.allMqttStatus.forEach(function(val){
                      let flagid = true;
                      if(val.uuid==ar[0]){
                      //判断里面是否有uuid相同的情况
                        flagid = false;
                        flag = false;
                        let flagData = true;
                        let newDataObj = {};
                        let newDataArr = [];
                        val.data.forEach(function(three){
                          if(three.status==ar[1]){
                          //判断status是相同就直接将里面对象替换并放到个新的数组里面
                            flagData = false;
                            newDataObj.status = ar[1];
                            newDataObj.value = ar[2];
                            newDataObj.time = ar[3];
                            newDataArr.push(newDataObj)
                          }else{
                          //不同就直接放到新的数组里面,该uuid下新的data数组
                            
                            newDataArr.push(three);
                          }
                        });
                        if(flagData){
                        //该uuid下没有这个status,将uuid的data里push个新对象
                          let o = {
                            status:ar[1],
                            value:ar[2],
                            time:ar[3],
                          }
                          _this.allMqttStatus.forEach(function(one){
                            if(one.uuid==val.uuid){
                              one.data.push(o)
                            }
                          })
                        }else{
                        //该uuid下有status，将uuid的data付值为newDataArr;
                         _this.allMqttStatus.forEach(function(two){
                            if(two.uuid==val.uuid){
                              two.data = newDataArr;
                            }
                          })
                        }
                      }
                    });
                    if(flag){
                    //如果没有这个uuid的对象
                      let param = {};
                      param.uuid = ar[0];
                      param.data = [];
                      let newObj = {};
                      newObj.status = ar[1];
                      newObj.value = ar[2];
                      newObj.time = ar[3];
                      param.data.push(newObj);
                      _this.allMqttStatus.push(param);
                    }

              } 
             
              //进给速度
              if(ar[1] == "WHstatus_FeedV"){
                if(_this.feedv.length==0){
                  let feed = {};
                  let obj = {};
                  let arr = [];
                  feed.uuid = ar[0];
                  obj.status = ar[1];
                  obj.value = ar[2];
                  obj.time = ar[3];
                  arr.push(obj);
                  feed.data = arr;
                  _this.feedv.push(feed);
                }else{
                  _this.feedv.forEach(function(val){
                    if(val.uuid == ar[0]){
                      let obj = {};
                      obj.status = ar[1];
                      obj.value = ar[2];
                      obj.time = ar[3];
                      val.data.push(obj)
                    }
                  })
                }
              }     
            _this.mqtts = ar;
        })
        detailMqtt.connect([{
          'uuid': uuid,
          'enable': true,
          "item": '+'
        }]);
      },
      delParam(key){
        let innerText = this.innerText;
        for(var i in innerText){
          if(innerText[i].uuid = this.uuid){
            let newArr = [];
            innerText[i].data.forEach(function(da){
              if(da.status == key){
                newArr.push(da)
              }
            })
            innerText[i].data = newArr;
          }
        }
      },
      addParam(arr){
        let that = this;
        this.innerText.forEach(function(it){
          arr.forEach(function(mp){
            if(it.uuid == that.uuid){
              let flag = true;
              it.data.forEach(function(id){
                if(id.status == mp.key){
                  flag = false;
                }
              });
              if(flag&&mp.value!==null){
                let obj = {};
                obj.alias = mp.value;
                obj.status = mp.key;
                obj.time = "";
                obj.value = "";
                it.data.push(obj);
              }
            }
          })
        })
      },
      //拉去下拉框参数列表
      allmachinedropList(res){
        let that = this;
        api.addMachineParameters(res)
          .then(function(res){
            if(res.data.result=="success"){
              that.li = res.data.value;
            }
          })
      },
      getMachineData(obj){
        api.machineParameterList(obj)
          .then(res => {
            //获取设备参数
            if(res.data.result=="success"){
              let that = this;
              console.log(res.data.value.params)
              this.machineParameterList = res.data.value.params;
            }
          });
        
        this.detailMqtt(obj.uuid)
      },
      handleClose(done) {
        this.$confirm(this.$t('message.makesureoff'))
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      styleInit(){
        this.containerWidth = this.$refs.detail_container.getBoundingClientRect().width;
        let  floatcolnum = this.containerWidth/this.cardWidth
        let intcolnum = parseInt(floatcolnum);
        this.intcolnum = intcolnum;
        if(this.colnumSet !== ''){
          if(this.colnumSet > intcolnum){
            this.colnum = intcolnum;
            this.colnumSet = intcolnum;
          }else {
            this.colnum = this.colnumSet;
          }
        }else{
          this.colnum = intcolnum;
        }
      }
    },
    created(){
      let width = window.screen.width*0.8 + "px";
      let height = window.screen.height*0.6 + "px";
      this.feedvStyle = {
          width:width,
          height:height
      };
    },
    mounted(){
      this.$emit("success","success");
      this.uuid = this.$route.query.uuid;
      this.alias = this.$route.query.alias;
      var _this = this;
      this.handleCommand(this.$route.query.alias);
      let obj = {};
      obj.uuid = this.$route.query.uuid;
      api.allMachineDropList(obj)
        .then(res => {
          if(res.data.result=="success"){
            this.machinelist = res.data.values;
          }
        });
      this.getMachineData(obj);
      this.title = this.$route.query.alias;
      this.yesterEffi();
     
      this.styleInit();
     // window linstener
      window.onresize = this.styleInit.bind(this);
    },
    updated(){
      
    },
    watch:{
      'isexpand':function(){
        this.styleInit();
      },
      'colnumSet' :function(){
        this.styleInit();
      },
       'colnum' : function(){
        this.$refs.card_content_wrap.style.width = (this.colnum * this.cardWidth + 2)+'px';
      },
      uuid:function(val){
        let obj = {};
        console.log("uuid----------change")
        obj.username = "ly1024";
        obj.uuid = val;
        obj.openid = "oh9Djvup_15urtYmlsZIF-5SITeo";
        obj.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMTgzMjY4ODI2NTgiLCJleHAiOjE1MTc1Mjk2MDAsImlhdCI6MTUxNDk3MjE1OH0.kxgTb-2Vwvq8cTA19fc75xsF3wW0nKsBmSYL73m3Ww4";
        this.getMachineData(obj);
        this.uuid = val;
        if(!this.uuid){
          this.uuid = this.$route.query.uuid;
        }
        var that = this;
        this.innerText.forEach(function(o){
          if(o.uuid==that.uuid){
            that.innerCard = o.data;
          }
        })
        this.allmachinedropList({uuid:this.uuid})
      },
      selected(val){
      },

      allMqttStatus(res){
        console.log(res)
        console.log("all_________________________________________________")
      },
      innerText(val){
        var that = this;
      },
      feedv(val){
      },
      value(res){
        console.log(res,this.machinelist)
        let o = this.machinelist.filter(val => {
          return val.alias == res
        });
        this.handleCommand(o)
      },
      machineParameterList:function(val){
        let that = this;
        val.forEach(function(a){
          if(a.value!==null){
            that.delParam(a.key)
          }
        })
      },
      alias:function(val){
        this.alias = val
      },
    }
  }
</script>