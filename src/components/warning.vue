<template>
	<div class="warning" id="waring">
    <el-card class="box-card" v-for="(items,index) in card" :key="index">
      <h4>{{items.alias}}</h4>
      <div class="machine">{{items.uuid}}</div>
      <div v-for="(item,index) in items.alarminfo" :key="index" class="text item">
        <div class="warning-info">{{ item.value }}</div>
        <div class="warning-time"><span class="time">{{item.timeStamp.split('T').join(' ').split('.')[0]}}</span></div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
@import '../style/warning.scss';
</style>

<script type="text/javascript">
   import * as api from '../api/server.js';
   import NcMqttClient from '../mqtt/mqttEchart.js';
   import md5 from 'js-md5';
   import Vue from 'vue';
   import Cookies from 'js-cookie'
   export default {
    data() {
      return {
        card:[],
      }
    },
    mounted(){
      let obj = {};
      console.log(this.$router,window.locahistory)
      let that = this;   
      api.getFocusMachines()
        .then(res => {
          if(res.data.result == "success"){
            this.getFocus(res.data.values)
          }
        })
        .catch(err => {
          console.log(err)
        })  
      obj.username = "ly1024";
      obj.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMTgzMjY4ODI2NTgiLCJleHAiOjE1MTYyMzM2MDAsImlhdCI6MTUxMzY0ODAxM30.lv9HRoXgamAi-Xw4aWgU0Wpr1hMoRRHd67nUcf7vPLw"
      api.htrMsg()
        .then(res => {
            if(res.data.result=="success"){
              this.card = res.data.value;
              console.log(res.data.value)
              this.$emit("success","success");
            }
        })
        .catch(err => {

        })
    },
    methods:{
      getHistory(){
      
      },
      panstart(res){
        console.log("start"+res)
      },
      panmove(res){
        console.log(res)
      }
    }
   }
</script>