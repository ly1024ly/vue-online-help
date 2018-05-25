<template>
	<div class="login">
    <header>
      <div class="header-icon">
        <img src="../img/logo.png" width="90" />
        <span class="website-banner-name">
          {{$t('message.nccloud')}}
        </span>
      </div>
      <el-dropdown @command="changeLang">
        <span class="el-dropdown-link">
          {{loginlan}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="cn">中文</el-dropdown-item>
          <el-dropdown-item :command="en">英文(English)</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </header>
		<div class="box">
			<p>{{$t('message.login')}}</p>
			<el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
				<el-form-item :label='$t("message.account")' prop="phone">
				    <el-input type="phone" v-model="ruleForm2.phone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item :label='$t("message.password")' prop="checkPass">
				    <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item :label='this.$t("message.verification_code")' prop="age" class="lcode">
				    <el-input v-model="ruleForm2.age"></el-input>
				    <label class="getCode" :class="this.class" @click="getCode('ruleForm2')" v-model="ruleForm2.phone">{{ message }}</label>
				</el-form-item>
				<el-form-item>
				    <el-button type="primary" @click="submitForm('ruleForm2')">{{ $t("message.submit") }}</el-button>
				    <p>
              <router-link to="register"><span>{{ $t('message.register') }}</span></router-link>
              <router-link to="forgotpwd"><span>{{ $t("message.forget_password") }}</span></router-link>
            </p>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<style lang="scss" scoped>
	@import "../style/login.scss"
</style>
<script>
  import * as api from '../api/server.js';
  import {mapState, mapGetters,mapMutations} from 'vuex'
  import axios from 'axios'
  import md5 from 'js-md5'
  import Cookies from 'js-cookie'
  export default {
    data() {
      var checkAge = (rule, value, callback) => {
      	const rul = /^\d{6,6}$/;
    		let flag = rul.test(value);
        if (!value) {
          return callback(new Error(this.$t('message.verification_code_must_be_filled')));
        } else if (!flag) {
	          callback(new Error(this.$t('message.verification_code_dight_alert')));
	      } else {
	          callback();
	      }   		
      };
    	var checkphone = (rule,value,callback) => {
    		const rul = /^1((3[0-9]|4[57]|5[0-35-9]|7[035678]|8[0-9])\d{8}$)/;
    		let flag = rul.test(value);
    		if(value===""){
    			callback(new Error(this.$t('message.account_be_filled')))
    		}else{
    			callback();
    		}
    	};
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('message.enter_your_password_again')));
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error(this.$t('message.inconsistent_password_entry_twice')));
        } else {
          callback();
        }
      };
      return {
      	class:"",
      	num:1,
        loginlan:"Language",
        cn:'zh-CN',
        en:'zh-US',
      	message: this.$t("message.get_verification_code_for_free"),
        ruleForm2: {
          phone: '',
          checkPass: '',
          age: ''
        },
        rules2: {
          phone: [
            { validator: checkphone, trigger: 'blur' }
          ],
          checkPass: [
            { required: true,  message: this.$t("message.string_of_length"), trigger: 'blur' }
          ],
          age: [
            { validator: checkAge, trigger: 'blur' }
          ]
        },
        interval:null
      };
    },
    mounted(){
      var type=navigator.appName;
      let lang = Cookies.get("locale")==null ? null : Cookies.get("locale");
      console.log(lang)
      if(lang == null){
        if (type=="Netscape"){
          lang = navigator.language
        } else {
          lang = navigator.userLanguage
        }
      
      //lang = lang.substr(0,2)
      }
      console.log(lang)
      if(lang===undefined||lang=="zh-CN"){
          this.language = "Language";
          this.$i18n.locale = 'zh-CN';
          Cookies.set("locale","zh-CN");
      }else{
          this.language = "English";
          this.$i18n.locale = 'zh-US';
          Cookies.set("locale","zh-US");
      }

      //刷新提示中英文
      this.message = this.$t("message.get_verification_code_for_free");

      document.title = this.$t('message.'+ this.$route.name);
      let username = Cookies.get("username");
      let pass = Cookies.get("password");
      let token = Cookies.get("token");
      if(username&&pass&&token){
        this.$router.push({path:'/production'})
      }
    },
    updated(){
      document.title = this.$t('message.'+ this.$route.name);
    },
    created() {
       
    },
    computed:{
      ...mapState(['user']),
    },
    watch:{
      loginlan(res){
        this.account = this.$t("message.account");
        this.password = this.$t("message.password");
        this.verification_code = this.$t("message.verification_code");
        this.message = this.$t("message.get_verification_code_for_free");
      },
      message(val){
        console.log(val)
      },
    },
    methods: {
      ...mapMutations(['USER_INFO']),
      open(msg){
        this.$alert(msg, '', {
          confirmButtonText: this.$t('message.ok')
        });
      },
      success(data) {
        this.$message({
          message: data,
          type: 'success'
        });
      },
      fail(data) {
        this.$message.error(data);
      },
      changeLang(command){
        this.$i18n.locale = command;
        Cookies.set('locale',command);
        if(command=="zh-CN"){
          this.loginlan = "中文";
        }else{
          this.loginlan = "English";
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
        var _this = this;
          if (valid) {
            const obj = {};
            obj.account = this.ruleForm2.phone;
            obj.password = md5(this.ruleForm2.checkPass);
            obj.vercode = this.ruleForm2.age.toString();
            api.userLogin(obj)
              .then(function(res){
                if(res.data.result=="success"){
                  //_this.setCookies(obj);
                  console.log(res)
                  let o = {
                    openid:res.data.value.openid,
                    vercode:res.data.value.vercode,
                    username:res.data.value.username,
                    token:res.data.token,
                    password:res.data.value.password,
                    _id:res.data.value._id
                  }
                  _this.setCookies(o);
                  api.fomatData()
                  .then(result => {
                    if(result.data.result=="success"){
                      let formatTime = JSON.stringify(result.data.value);
                      sessionStorage.formatTime = formatTime;
                    }
                  })
                  _this.$router.push({path:'/production'})
                }else{

                  _this.$ssm(res.data)
                }
              })
              .catch(function(err){
              })
           
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      setCookies(obj){
        var day = new Date();
        var str = "";
        day.setTime(day.getTime() + 7*24*60*60*1000);
        for(var key in obj){
          Cookies.set(key,obj[key],{expires:7});
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      getCode(formName) {
          let account = this.ruleForm2.phone
	      	if(account){
	      		let index = 60;
		        this.class="unclick";
		      	let text = this.$t('message.resend') ;
      			var _this = this;
            let free = _this.$t("message.get_verification_code_for_free")
	      		_this.interval = setInterval(
				     	function(){
                let msg = text
				     		if(index>0){
				     			index--;
				     			_this.message = _this.$t('message.resend') +"("+index+")";
				     		}else{
                  clearInterval(_this.interval);
                  _this.interval = null
				     			_this.message = free;
			            _this.class = ""
				     		}
				     	},1000);
              let pam = {};
              pam.phone = account;
              pam.num = this.num;
              api.vercodeAjax(pam)
                .then(function(res){
                  if(res.data.result=="success"){
                    _this.success(_this.$t('message.send_successfully'))
                  }else{
                    _this.$ssm(res.data)
                    _this.message = _this.$t("message.get_verification_code_for_free");
                    _this.class = ""
                  }
                })
                .catch(function(err){
                  _this.$ssm(res.data)
                  _this.message = _this.$t('message.get_verification_code_for_free');
                  _this.class = ""
                })  
	      	}      	
      	}
    	}
  	}
</script>