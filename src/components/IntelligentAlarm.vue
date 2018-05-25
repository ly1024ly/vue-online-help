<template>
  <div class="smart-alarm" id="smartalarm">
    <div class="machine-select">
      <el-form ref="machineform" :model="machineform" label-width="140px">
        <el-form-item :label="$t('message.select_device')">
          <el-select v-model="machineform.machine_selected" :placeholder="$t('message.select_device')">
            <el-option v-for="(value,index)  in machineList" :key=index :label=value.alias :value=value.uuid></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="alarm-set-container">
      <div>
        <el-radio-group v-model="setSelected">
      <el-radio-button label="analog"  >{{ $t('message.outrange_alarm')}}</el-radio-button>
      <el-radio-button label="info">{{ $t('message.work_status') }}</el-radio-button>
      </el-radio-group>
      </div>
      <div class="alarm-set-area">

        <el-card class="box-card" v-show="setSelected == 'analog'">
            <div slot="header" class="clearfix">
              <span>{{ $t('message.intelligent_alarm_config_set_msg') }}</span>
            </div>
            <el-form ref="setform" :model="setform" label-width="140px">
              <el-form-item  :label="$t('message.parameter') ">
                  <el-row :gutter="20">
                    <el-col :span="10">{{ $t('message.low') }}</el-col>
                    <el-col :span="10">{{ $t('message.high') }}</el-col>
                  </el-row>
              </el-form-item>
              <el-form-item v-for="(item, index) in analogConfigList" :key="index" :label="$sl(item.key)">
                  <el-row :gutter="20">
                    <el-col :span="10"><el-input v-model="setform[item.key].low"> </el-input></el-col>
                    <el-col :span="10"><el-input v-model="setform[item.key].high"></el-input></el-col>
                  </el-row>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="onSubmit">{{ $t('message.save') }}</el-button>
              </el-form-item>
            </el-form>
        </el-card>

        <el-card class="box-card" v-show="setSelected == 'info'">
          <div slot="header" class="clearfix">
              <span>{{ $t('message.intelligent_alart_status_set_msg') }}:</span>
          </div>
          <div class="ia-status-box">
            <el-checkbox-group v-model="infoset">
              <el-checkbox  v-for="(value, index) in infoConfigList"  :label="value.key" :key="index">{{ $sl(value.key) }}</el-checkbox>
            </el-checkbox-group>
          </div>
            <el-button type="primary" @click="onSubmitInfo">{{ $t('message.save') }}</el-button>
            
        </el-card>

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../style/intelligentalarm.scss";
</style>

<script type="text/javascript">
  import * as api from "../api/server.js";
  import {showSuccess, showError, showServerError} from "../util/MessageDeal";
  import get from '../api/get';
  export default {
    props :["lang"],
    data() {
      return {
        // 机器数据列表表单model
        machineform : {
          machine_selected : ''
        },
        machineList:[
          {alias : ''}
        ],
        analogConfigList :[],
        infoConfigList:[],
        setSelected : 'analog',
        setform : {
         
        },
        infoset : []
      };
    },
    mounted() {
      this.$emit("success", "success");
      this.getDeviceData();
    },
    watch :{
      'machineform.machine_selected' : function(){
        this.updataConfig();
      }
    },
    methods: {
      /**@method
       * @description根据lang去显示参数名称
       * 
       */
      getParamByLang(lang, item){
      if(lang == "English"){
        let en_param = item.key; 
        return en_param.substring(en_param.indexOf('_')+1,en_param.length);
      }else {
        return item.value;
      }
      },
      /**@method
       * @description 设备选择改变时触发数据更新
       */
      updataConfig(){
        let types = ['analog','info'];
        
        let uuid = this.machineform.machine_selected;
        let configList = [];
        if(uuid !== ''){
           types.forEach(element => {
             this.getConfigData({
               type : element,
               uuid
             })
           });
        }
      },
      
      /**
       * @method
       * @desc 获取机器数据，以生成设备列表
       */
      getDeviceData(){
        api.allMachineDropList().then( (res) =>{
          if(res.data.result === 'success'){
            if(res.data.values.length > 0){
              this.machineList = res.data.values.map((child, index)=>{
                return {
                  alias : child.alias,
                  uuid : child.uuid,
                }
              })
              this.$set( this.machineform, 'machine_selected', this.machineList[0].uuid )
              this.updataConfig();
            }
          }else {
            this.$ssm(res.data);
          }
        } )
      },

      /**
       * @description config submit
       * 
       */
      onSubmit(){
        let uuid = this.machineform.machine_selected;
        let type = this.setSelected;

        //get value to post
        let values = [];
        let formdata = this.setform;
        for(var key in formdata){
          let a = {
            key,
            value : formdata[key].value,
            high : formdata[key].high!==''? Number(formdata[key].high) : formdata[key].high,
            low:formdata[key].low !== '' ? Number(formdata[key].low) :formdata[key].low
          }

          if(a.high < a.low){
            showError(this.$t('message.lowMorehigh'))
            return
          }
          values.push(a);
        }

        

        //post data to save
        api.setIntelligentAlarm({uuid,type,values}).then((res)=>{
          if(res.data.result == 'success'){
            showSuccess(this.$t('message.op_success'))
          }else {
            this.$ssm(res.data)
          }
        })

      },
      onSubmitInfo(){
        let uuid = this.machineform.machine_selected;
        let type = this.setSelected;
        let values = [];
        let formdata = this.infoset;
        let allstatudata = this.infoConfigList;
        //根据用户选择进行 保存数据填充
        allstatudata.map((item)=>{
          if(formdata.indexOf(item.key) >= 0){
            item.status = true;
          }else {
            item.status = false;
          }
          item.value = this.$sl(item.key);
          values.push(item)
        })

        //post data to save
        //post data to save
        api.setIntelligentAlarm({uuid,type,values}).then((res)=>{
          if(res.data.result == 'success'){
            showSuccess(this.$t('message.op_success'))
          }else{
            this.$ssm(res.data)
          }
        })

      },

      /**
      *@description 获取配置数据
      */
      getConfigData(parm){
          let configdata = [];
          this.infoset = [];
          let newsetform ={};
          api.getIntelligentAlarm(parm).then( (res) => {
          if(res.data.result === 'success'){
            if(res.data.value&&res.data.value.values.length>0){
        
                let datavalues = res.data.value.values;
                configdata = datavalues.map( function(child, index){
                  if(parm.type == 'analog'){
                  newsetform[child.key] = {
                    high: child.high,
                    low : child.low,
                    value: child.value
                  }
                  }else if(parm.type == 'info'){
                    if(child.status){
                      this.infoset.push(child.key);
                    }
                  }
                  return child
                }.bind(this)) 
                //
                if(parm.type == 'analog'){
                   this.setform = newsetform;
                  }     
            }
            if(parm.type == 'analog'){
              this.analogConfigList =  configdata;
            }else if(parm.type == 'info'){
              this.infoConfigList = configdata;
            } 
          } else{
            this.$ssm(res.data);
          }
      })
      }
  }};
</script>