<template>
	<div class="all">
		<div class="card-content">
			<card :all="allMachine" v-for="(item,index) in allMachine" :item="item" :key="index" :index="index" :icon="true" v-on:chooseParam="chooseparam" :selected="selected" :collect="clickFoucsMachine" v-on:remove="removeCard"></card>
			<el-card class="box-card"  @click="addMachine()">
  			<el-button type="text" @click="addMachine"><i class="el-icon-circle-plus" ></i></el-button>
  		</el-card>
		</div>
	    <el-dialog
	      :title=this.data
	      :visible.sync="dialogVisible"
	      :width=this.width>
	      <div v-show="this.pop=='add' ? true : false">
	      	<el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
					  <el-form-item :label="$t('message.device_no')">
					    <el-input v-model="formLabelAlign.uuid"></el-input>
					  </el-form-item>
					  <el-form-item :label="$t('message.verification_code')">
					    <el-input v-model="formLabelAlign.vercode"></el-input>
					  </el-form-item>
					  <el-form-item :label="$t('message.alias')">
					    <el-input v-model="formLabelAlign.alias"></el-input>
					  </el-form-item>
					</el-form>
	      </div>
	      <div v-show="this.pop=='delete' ? true : false">{{ $t('message.ensure_delete_machine') }}</div>
	      <select v-model="selected" v-show="this.pop=='select' ? true : false">
	        <option v-for="(item,index) in param" :key="index" :value="item.key">{{ $sl(item.key)}}</option>
	      </select>
	      <span slot="footer" class="dialog-footer">
	        <el-button @click="dialogVisible = false">{{ $t("message.cancel") }}</el-button>
	        <el-button type="primary" @click="saveParam()" v-show="this.pop=='select' ? true : false">{{ $t("message.ok") }}</el-button>
	        <el-button type="primary" @click="addParam()" v-show="this.pop=='add' ? true : false">{{ $t("message.ok") }}</el-button>
	      </span>
	    </el-dialog>
	</div>
</template>

<style lang="scss" scoped>
@import "../style/allmachine.scss";
</style>

<script type="text/javascript">
import * as api from "../api/server.js";
import Cookies from "js-cookie";
import card from "./card.vue";
export default {
  props :["lang"],
  data() {
    return {
      allMachine: [],
      param: [],
      add: false,
      width: "30%",
      dialogVisible: false,
      selected: "",
      chooseuuid: "",
      selectedma: "",
      collect: "",
      pop: "",
      data: this.$t("message.select_the_parameters_shown_here"),
      labelPosition: "right",
      formLabelAlign: {
        uuid: "",
        vercode: "",
        alias: ""
      },
      obj: {
        uuid: "",
        alias: "",
        item: "",
        param: "",
        enable: false
      }
    };
  },
  components: {
    card
  },
  computed: {},
  mounted() {
    this.$emit("success", "success");
    let that = this;
    this.width = "350px";
    api.getAllMachine().then(function(res) {
      if (res.data.result == "success") {
        res.data.values;
        console.log(res);
        res.data.values.forEach(function(val) {
          that.obj = {
            uuid: val.uuid,
            alias: val.alias,
            //参数的服务器状态
            item: val.item,
            enable: val.webversion.enable,
            //设置每一项参数选择的本地状态
            param: val.item ==="" ? 'WHstatus_HadCompletedPercent' : val.item
          };
          that.allMachine.push(that.obj);
        });
      }
    });
  },
  methods: {
    chooseparam(val) {
      let that = this;
      this.pop = "select";
      //当点击对话框时 将参数选择默认值设为当前选择机器的参数值
      this.selected = val.param === '' ? val.item : val.param;
      api.addMachine(val.uuid).then(function(res) {
        if (res.data.result == "success") {
          that.dialogVisible = true;
          that.chooseuuid = val.uuid;
          that.data = that.$t("message.select_the_parameters_shown_here");
          that.param = res.data.value;
        } else {
          warning(res.data.result);
        }
      });
    },
    success(data) {
      this.$message({
        message: data,
        type: 'success'
      });
    },
    fail(data){
      this.$message.error(data);
    },
    addMachine() {
      this.dialogVisible = true;
      this.pop = "add";
      this.data = this.$t('message.new_device_add_alert');
    },
    /**@augments
     * @description 根据语言返回不同语言状态
     */
    getParamByLang(lang, item){
      if(lang == "English"){
        return item.en_value;
      }else {
        return item.value;
      }
    },
    warning(res) {
      this.$alert(res, this.$t('message.tip'), {
        confirmButtonText: this.$t("message.ok"),
        callback: action => {
          this.$message({
            type: "info",
            message: `action: ${action}`
          });
        }
      });
    },
    addParam() {
      let that = this;
      api.addMachines(this.formLabelAlign).then(function(res) {
        if (res.data.result == "success") {
          that.$ssm(res.data);
          that.obj = {
            uuid: that.formLabelAlign.uuid,
            alias: that.formLabelAlign.alias,
            item: "",
            enable: true,
            param: 'WHstatus_HadCompletedPercent'
          };
          that.allMachine.push(that.obj);
        } else {
          that.$ssm(res.data)
        }
      });
      this.dialogVisible = false;
    },
    removeCard(parm) {
      let that = this;
      that.$confirm(that.$t('message.are_you_sure_you_want_to_delete_this_device'), that.$t('message.warm_tips'), {
              confirmButtonText: that.$t('message.ok'),
              cancelButtonText: that.$t('message.cancel'),
              type: 'warning',
              center: true
          }).then(() => {
              api.removeMachine({ uuid: parm.uuid }).then(function(res) {
                if (res.data.result == "success") {
                  let arr = that.allMachine.filter(val => {
                    console.log(val,parm)
                    return val.uuid!==parm.uuid
                  })
                  that.allMachine = arr;
                }
              });
              console.log(this.allMachine);
        },()=>{})
    },
    saveParam() {
      this.dialogVisible = false;
      let obj = {
        uuid: this.chooseuuid,
        item: this.selected
      };
      let that = this;
      api.saveHomeParameter(obj).then(function(result) {
        if (result.data.result == "success") {
          let arr = [];
          that.allMachine.forEach(function(res) {
          console.log(res)
            if (res.uuid == that.chooseuuid) {
              that.obj = {
                uuid: res.uuid,
                alias: res.alias,
                item: res.item,
                enable: res.enable,
                //设置选择值到自身本地状态，当未选择时保存默认值
                param: that.selected === "" ? 'WHstatus_HadCompletedPercent' : that.selected,
              };
              arr.push(that.obj);
            } else {
              arr.push(res);
            }
          });
          that.allMachine = arr;
        } else {
          console.log("fail")
          that.$ssm(res.data)
        }
      });
    }, 
    handleClose(done) {
      this.$confirm(this.$t("message.makesureoff"))
        .then(_ => {
          done();
          this.selected = undefined;
        })
        .catch(_ => {});
		},
		/**@method
		 * @param
		 * @returns
		 * @description 设备收藏
		 */
		followMachine(uuid,enable,key) {
			api.focusMachines({uuid,enable}).then(
        (res) => {
          if(res.data.result === "success"){
            this.allMachine[key].enable = enable;
          } else {
            this.$ssm(res.data);
          }
        }
      )
    },
    /**@method
     * @description 设备收藏点击事件函数
     */
    clickFoucsMachine(item,key){
      this.followMachine(item.uuid, !item.enable, key);
    }


  },
  watch: {
    allMachine(val) {
      console.log(val);
    }
  }
};
</script>