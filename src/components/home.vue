<template>
  <div v-bind:style="objStyle">
  <div class="line"></div>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b">
    <el-menu-item index="1"><i @click="asideShow" v-bind:class="this.class
"></i></el-menu-item>
    <el-menu-item index="2" class="lang">
      <el-dropdown @command="changeLang">
        <span class="el-dropdown-link">
          {{language}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" >
          <el-dropdown-item :command="cn">中文</el-dropdown-item>
          <el-dropdown-item :command="en">英文(English)</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>     
    </el-menu-item>
  </el-menu>
  <el-container style="height: 100%; border: 1px solid #eee;font-family: Monospaced Number,Chinese Quote,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif;">
    <el-aside width="260px" style="background-color: rgb(238, 241, 246)" v-show="is">
      <el-menu>
      <el-menu-item index="2" @click="production('production')">
        <i class="iconfont">&#xe629;</i>
        <span slot="title">{{ $t("message.menu2") }}</span>
      </el-menu-item>
      <el-menu-item index="1" @click="warning('warning')" >
        <i class="iconfont">&#xe756;</i>
        <span slot="title">{{ $t("message.menu1") }}</span>
      </el-menu-item>
      <el-menu-item index="3" @click="allmachine('allmachine')">
        <i class="iconfont">&#xe639;</i>
        <span slot="title">{{ $t("message.menu3") }}</span>
      </el-menu-item>
          <el-menu-item index="4" @click="intelligentalarm('intelligentalarm')">
            <i class="iconfont">&#xe609;</i>
            <span slot="title">{{ $t("message.menu4") }}</span>
          </el-menu-item>
          
          <el-submenu index="1" >
            <template slot="title">
              <i class="el-icon-tickets"></i>
              <span>{{ $t("message.menu5") }}</span>
            </template>
            <el-menu-item-group>
            
              <el-menu-item index="1-1" @click="file('file')">{{ $t("message.menu6") }}</el-menu-item>
              <el-menu-item index="1-2">{{ $t("message.menu11") }}</el-menu-item>
              <el-menu-item index="2-3">{{ $t("message.menu12") }}</el-menu-item>
              <el-menu-item index="2-3" @click="file('publish')">{{ $t("message.publish") }}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
 
          <el-menu-item index="7" @click="userinfo('userinfo')">
            <i class="icon-person"></i>
            <span slot="title">{{ $t("message.menu7") }}</span>
          </el-menu-item>
     
        <!-- <router-link to="template"> -->
          <el-submenu index="8">
            <template slot="title"><i class="icon-templet"></i>{{ $t("message.menu8") }}</template>
            <el-menu-item-group>
              <el-menu-item index="8-0" @click="creatTemp">{{this.$t("message.new_exhibition_board")}}</el-menu-item>
              <!-- <router-link :to="'/templet/'+item.displayname" v-for="(item,index) in menu"> -->
                <el-menu-item :index="'8-'+index+1" @click = "jumpTemp('templet/',item.displayname)" v-for="(item,index) in menu" :key="index">
                  {{item.displayname}}
                </el-menu-item>
              <!-- </router-link> -->
            </el-menu-item-group>
          </el-submenu>
        <!-- </router-link> -->
        <el-submenu index="9">
          <template slot="title"><i class="icon-service"></i>{{ $t("message.menu9") }}</template>
          <el-menu-item-group>
            <el-menu-item index="2-1" @click="jumpPages('https://verify.weihong.com.cn/view/index.html')">{{ $t("message.product_registration") }}</el-menu-item>
            <el-menu-item index="2-2" @click="jumpPages('http://reg.weihong.com.cn:99/')">{{ $t("message.product_search") }}</el-menu-item>
            <el-menu-item index="2-3" @click="jumpPages('http://cn.mikecrm.com/mJ1Cvw')">{{ $t("message.question_feedback") }}</el-menu-item>
            <el-menu-item index="2-4" @click="jumpPages('https://mp.weixin.qq.com/s/lVci6ZsJFUXDvZ3dA8okUw')">{{ $t("message.contact_us") }}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="10" @click="toLogin">
          <i class="icon-exit"></i>
          <span slot="title">{{ $t("message.menu10") }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container :class="cla" style="background-color: rgb(238, 241, 246);padding:0px">
      <div key="0" class='zaochen' v-show="show"><i class="el-icon-loading"></i></div>
      <el-header style="text-align: right; font-size: 12px;position:relative;display:none">
        <div class="title" style="fontSize:20px;">{{title}}</div>
      </el-header>
      <el-main :style="paddingVal">
        <transition-group name="fade" mode="out-in">
          <router-view key="1" v-on:title="getTitle" v-on:success="warningSucc" :lang="language" :isexpand="is"></router-view>
        </transition-group>
        <el-dialog :visible.sync="dialogShow" style="max-width:900px;min-width:800px;margin:0 auto;" center :title="new_exhibition_board" @close="hiddenDialog">
              <el-form :model="form" :rules="rules2" ref="ruleForm2">
                <el-form-item label="" prop="tempName">
                  <el-input v-model="form.tempName" :placeholder="please_enter_the_new_exhibition_board_name"></el-input>
                 </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="hiddenDialog">{{ $t("message.cancel") }}</el-button>
                <el-button type="primary" @click="creatTempForm">{{ $t("message.ok") }}</el-button>
              </span>
        </el-dialog>
      </el-main>
    </el-container>
    </el-container>
  </div>
</template>
<style lang="scss" scoped>
@import "../font/iconfont.css";
@import '../style/common.scss';
@import '../style/home.scss';
@import '../icon/stylus/style.scss';
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
  }
</style>
<script>
import Cookies from 'js-cookie';
import NcMqttClient from '../mqtt/mqttEchart.js';
import * as api from '../api/server.js';
import md5 from 'js-md5';
  export default {
    data() {
      let validatTempName = (rule, value, callback) => {
        let len = this.getByteLen(value)
        if (!value) {
            return callback(new Error(this.$t('message.please_enter_the_new_exhibition_board_name')));
          }else if(len>8){
            return callback(new Error(this.$t('message.please_enter_the_new_exhibition_board_name')));
          }else{
            callback();
        }
      };
      return {
        cla:'',
        show:true,
        is:true,
        title:'',
        cn:'zh-CN',
        en:'zh-US',
        router:this.$router.hash,
        paddingVal:{
          padding:"20px"
        },
        language:'多语言',
        class:'el-icon-d-arrow-left',
        objStyle:{
          height:window.screen.height+"px"
        },
        warMessage:"报警信息",
        newErr:{},
        error:JSON.parse(sessionStorage.getItem('ErrorMsg'))==null ? [] : JSON.parse(sessionStorage.getItem('ErrorMsg')),
        change:false,
        menu:[],
        dialogShow:false,
        menuFlag:false,
        had:[],
        form:{
          tempName:''
        },
        rules2:{
          tempName: [
              { validator: validatTempName, trigger: 'change' }
            ],
        },
      }
    },
    mounted:function(){
      let lang = Cookies.get('locale');
      console.log(lang)
      this.$router.beforeEach((to,from,next) => {
        console.log(to,from)
        if(to.name == 'login'){
          delete sessionStorage.ErrorMsg
        }
        next();
      });
      api.fomatData()
        .then(result => {
          if(result.data.result=="success"){
            let formatTime = JSON.stringify(result.data.value);
            sessionStorage.formatTime = formatTime;
          }
        })
      let user = Cookies.get("username");
      if(lang===undefined||lang=="zh-CN"){
          this.language = "Language";
          this.$i18n.locale = 'zh-CN';
          this.warMessage = "报警信息"
      }else{
          this.warMessage = "warning message";
          this.language = "English";
          this.$i18n.locale = 'zh-US';
      }
      if(this.$route.path=="/detail"){
        this.cla = "bgcolor";
      }else{
        this.cla = '';
      }
      if(window.screen.width<=768){
        this.is = false;
        this.class="el-icon-d-arrow-right";
      }
      api.getFocusMachines()
        .then(res => {
          if(res.data.result == "success"){
            this.getFocus(res.data.values)
          }
        })
        .catch(err => {
          console.log(err)
        }) 
      this.changeDocTitleByLang();
      this.getMenu();
    },
    watch:{
      menuFlag(res){
        console.log(res)
      },
      router(res){
        if(res == "MACGINE_DETAIL"){
          this.paddingVal = {
            padding:"0px"
          }
        } else {
          this.paddingVal = {
            padding:"20px"
          }
        }
      },
      newErr(res){
       
       // this.open(res.value,res.timestamp)
      },
      error(res){
        console.log("-------------changeing----------");
        //console.log(res,JSON.parse(sessionStorage.getItem('ErrorMsg')));
        let that = this; 
        let flag = true;
        //this.open(res[res.length-1].value,res[res.length-1].timestamp)
        
        this.change = true;
      }
    },
    computed: {
      new_exhibition_board:function(){
        return this.$t("message.new_exhibition_board")
      },
      please_enter_the_new_exhibition_board_name:function(){
        return this.$t("message.please_enter_the_new_exhibition_board_name")
      },


    },
    updated(){
      let that = this;
    
      this.router = this.$router.history.current.name;
      

      
    },
    methods:{
      changeDocTitleByLang(){
        if(this.$router.name != 'name'){
        document.title =this.$route.name ?  this.$t('message.' + this.$route.name) : '';
        }
      },
      getTitle(value){
        this.title = value;
      },
      file(res){
        var url = window.location.href;
        var index = url.lastIndexOf("#");
        var openU = url.slice(0, index);
        console.log(openU)
        window.open(openU + "#/" + res);
      },
      toLogin(){
        Cookies.remove("openid");
        Cookies.remove("password");
        Cookies.remove("token");
        Cookies.remove("username");
        Cookies.remove("vercode");
        delete sessionStorage.ErrorMsg;
        var url = window.location.href;
        var index = url.lastIndexOf("#");
        var openU = url.slice(0, index);
        window.open(openU + "#/login",'_self');
      },
      formatTime(msg) {
        var dateStyle = msg.substr(0, 10);
        var timeStyle = msg.substr(11, 8);
        var time = dateStyle + " " + timeStyle;
        return time;
      },
      intelligentalarm(res) {
        var url = window.location.href;
        var index = url.lastIndexOf("#");
        var openU = url.slice(0, index);
        console.log(openU)
        window.open(openU + "#/intelligentalarm");
      },
      changeLang(command){
        this.$i18n.locale = command;
        Cookies.set('locale',command);
        if(command=="zh-CN"){
          this.language = "中文";
          this.warMessage = "报警信息";
        }else{
          this.language = "English";
          this.warMessage = "warning message";
        }
        //语言切换
        this.changeDocTitleByLang();
      },
      warningSucc(value){
        if(value=="success"){
          this.show = false;
        }
      },
      open(uuid,res,time) {
        const h = this.$createElement;
        this.$notify({
          title: this.warMessage,
          dangerouslyUseHTMLString: true,
          message: `<p>${uuid}</p><strong>${res}</strong><p>${time}</p>`,
          type:"warning"
        });
        this.change = false;
      },
      getFocus(res){
        this.text = "fgjirewt"
        let user = Cookies.get("username");
        let pass = Cookies.get("password");
        let that = this;
        var msgErrorMqtt = new NcMqttClient(user, pass, function(_1, _2, _3, _4, _5){
          setTimeout(function(){
            let device = res.find(val => {
              return val.uuid == _1
            })
            that.msgError(_1, _2, _3, _4, _5,device.alias)
          },100)
        });
        msgErrorMqtt.setErrorFlag(true);
        let f = [];
        for(var j = 0; j < res.length; j++) {
          f.push({
            'uuid': res[j].uuid,
            'enable': true,
            "item": 'WHstatus_Error'
          });
        }
        msgErrorMqtt.connect(f);
      },
      msgError(uuid, status, value, timestamp, id, alias) {
        var msgErrorArr = [];
        //==========取出来的值如果是数字的话装整形，否则不做任何操作。
        var i = parseFloat(value);
        let that = this;
        if(isNaN(i)) {
          value = value;
        } else {
          value = i;
        }
        let nid = id ? id : md5(uuid+status+value+timestamp);
        var machineInfo = {
          "uuid": uuid,
          "status": status,
          "timestamp": timestamp,
          "value": value,
          "id":nid
        }
        if(status == 'WHstatus_Error') {
          that.text = "ok"
          if(sessionStorage.getItem('ErrorMsg') === null){
            let result = this.error.find(val => {
                return val.id == nid
            });
            if(!result){
              this.newErr = machineInfo;
              this.open(alias,machineInfo.value,this.formatTime(machineInfo.timestamp));
              this.$set(this.error,this.error.length,machineInfo);
            }
            sessionStorage.ErrorMsg = JSON.stringify(this.error)
          } else {
            let arr = JSON.parse(sessionStorage.getItem('ErrorMsg'));
            let result = arr.find(val => {
                return val.id == nid
            });
            if(!result){
              //this.error.push(machineInfo);
              this.newErr = machineInfo;
              this.open(alias,machineInfo.value,this.formatTime(machineInfo.timestamp));
              this.$set(this.error,this.error.length,machineInfo);
            };
            sessionStorage.ErrorMsg = JSON.stringify(this.error)
          }
        }
      },
      styleChange(res){
        console.log(res)
        if(this.$route.path=="/login"){
         alert("login")
        }
      },
      warning(res){
        console.log(window.location.href)
        var url = window.location.href;
        var index = url.lastIndexOf("#");
        var openU = url.slice(0,index); 
        this.active = 'is-active';
        window.open( openU + '#/warning')
      },
      production(res){
        var url = window.location.href;
        var index = url.lastIndexOf("#");
        var openU = url.slice(0,index); 
        window.open( openU + '#/production')
      },
      allmachine(res){
        var url = window.location.href;
        var index = url.lastIndexOf("#");
        var openU = url.slice(0,index); 
        window.open( openU + '#/' +res);       
      },
      userinfo(res){
        var url = window.location.href;
        var index = url.lastIndexOf("#");
        var openU = url.slice(0,index); 
        window.open( openU + '#/' +res);        
      },
      jumpTemp(tem,name){
        var url = window.location.href;
        var index = url.lastIndexOf("#");
        var openU = url.slice(0,index);
        this.getMenu();
        window.open(openU + '#/' +tem+name)
      },
      jumpPages(url){
        window.open(url);
      },
      asideShow(){
        if(this.class=="el-icon-d-arrow-left"){
          this.class="el-icon-d-arrow-right";
          this.is = false;
        }else{
          this.class="el-icon-d-arrow-left";
          this.is = true;
        }
      },
      getMenu(name){
        let that = this
        that.menu = []
        api.getTempName()
          .then(res => {
            if(res.data.result=="success"){
              res.data.value.forEach(function(val) {

                let data = {
                    _id:val._id,
                    displayname:val.displayname,
                  };
                  that.menu.push(data)
              })
            }
             
          })
      },
      creatTemp(){
        this.dialogShow = true
      },
      hiddenDialog(){
        this.dialogShow = false;
        this.form.tempName = '';
        this.$refs['ruleForm2'].resetFields();
      },
      creatTempForm(){
        let that = this
        this.$refs['ruleForm2'].validate((valid) => {
          if(valid){
               let data = {
                 displayname:that.form.tempName,
                 params:[],
               }
               api.saveTempName(data)
                  .then(res => {
                    console.log(res)
                if(res.data.result=="success"){
                  that.$message({
                    message: this.$t('message.op_success'),
                    type: 'success'
                  });
                  this.getMenu()
                  this.hiddenDialog()
                    
                }else{
                   let error = 'error_no_'+ res.data.errorno
                  that.$message({
                    message: this.$t('message.'+error),
                    type: 'error'
                  });
                  this.getMenu()
                  this.hiddenDialog()
                }
               })
          }
        })
      },
      getByteLen(val) {
        let len = 0
        for (let i = 0; i < val.length; i++) {
          let a = val.charAt(i);
          if (a.match(/[^\x00-\xff]/ig) != null) {
            len += 2;
          }
          else {
            len += 1;
          }
        }
        return len;
      }
    }
  };
</script>