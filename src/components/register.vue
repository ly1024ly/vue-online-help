<template>
	<div>
		<header>
			<img src="../img/logo.png" width="90" />
			<span class="title">{{ $t('message.welcome_to_sign_up') }}</span>
			<router-link to="login"><span class="login">{{ $t('message.existing_user') }}</span></router-link>
		</header>
		<section :style="pd">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
			  <el-form-item :label="$t('message.name')" >
			    <el-input v-model="ruleForm.n"></el-input>
			  </el-form-item>
			  <el-form-item :label="$t('message.username')" prop="name">
			    <el-input v-model="ruleForm.name"></el-input>
			  </el-form-item>
			  <el-form-item :label="$t('message.phone_num')" prop="phone" type="tel">
			    <el-input v-model="ruleForm.phone"></el-input>
			  </el-form-item>
			  <el-form-item :label="$t('message.company_name')" >
			    <el-input v-model="ruleForm.company"></el-input>
			  </el-form-item>
			  <el-form-item :label="$t('message.contact_address')" >
			    <el-input v-model="ruleForm.addr"></el-input>
			  </el-form-item>
			   <el-form-item prop="email" :label="$t('message.email')">
				    <el-input v-model="ruleForm.email"></el-input>
				</el-form-item>
			   <el-form-item :label="$t('message.password')" prop="pass">
			    <el-input type="password" v-model="ruleForm.pass" auto-complete="off"></el-input>
			  </el-form-item>
			   <el-form-item :label="$t('message.confirm_password')" prop="cpass">
				    <el-input type="password" v-model="ruleForm.cpass" auto-complete="off"></el-input>
				</el-form-item>
			  <el-form-item :label="$t('message.verification_code')" prop="code" class="code">
			    <el-input v-model="ruleForm.code"></el-input>
			     <label class="getCode" @click="getCode('ruleForm')" :class="this.class">{{message}}</label>
			  </el-form-item>

			  <el-form-item >
			    <el-button type="primary" @click="submitForm('ruleForm')">{{ $t('message.sign_up_now') }}</el-button>
			  </el-form-item>
			</el-form>
			<aside class="">
				<img src="../img/kk.jpg" />
        <p>{{$t('message.sweeping_code') }}</p>
			</aside>
		</section>
	</div>
</template>

<style lang="scss" scoped>
@import '../style/register.scss';
</style>

<script>
import axios from 'axios'
import {mapActions,mapGetters,mapMutations} from 'vuex'
import md5 from 'js-md5'
  export default {
    data() {
    	var checkname = (rule,value,callback) => {
    		const rul = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;
    		let flag = rul.test(value);
    		if(value===""){
    			callback(new Error(this.$t('message.username_can_not_be_empty')))
    		}else if(!flag){
					callback(new Error(this.$t('message.username_ruler_alert')))
    		}else{
    			callback();
    		}
    	};
    	var checkphone = (rule,value,callback) => {
    		const rul = /^1((3[0-9]|4[57]|5[0-35-9]|7[035678]|8[0-9])\d{8}$)/;
    		let flag = rul.test(value);
    		if(value===""){
    			callback(new Error(this.$t('message.phonenum_not_null')))
    		}else if(!flag){
    			callback(new Error(this.$t('message.phonenum_ruler_alert'))) 
    		}else{
    			callback();
    		}
    	};
    	var checkemail = (rule,value,callback) => {
    		const rul = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    		let flag = rul.test(value);
      		if(value===""){
    			callback(new Error(this.$t('message.email_not_null')))
    		}else if(!flag){
    			callback(new Error(this.$t('message.email_ruler_alert')))
    		}else{
    			callback();
    		} 		
    	};
    	var checkpass = (rule,value,callback) =>{
	        if (value === '') {
	          callback(new Error(this.$t('message.enter_your_password_again')));
	        } else if (value !== this.ruleForm.pass) {
	          callback(new Error(this.$t('message.inconsistent_password_entry_twice')));
	        } else {
	          callback();
	        }
    	};
    	var checkcode = (rule,value,callback) =>{
    		const rul = /^\d{6,6}$/;
    		let flag = rul.test(value);
 	        if (value === '') {
	          callback(new Error(this.$t('message.get_verification_code_for_free')));
	        } else if (!flag) {
	          callback(new Error(this.$t('message.verification_code_dight_alert')));
	        } else {
	          callback();
	        }   		
    	}
      return {
      	num:1,
        class:"",
				message: this.$t('message.get_verification_code_for_free'),
        ruleForm: {
          name: '',
          n:'',
          company:'',
          addr:'',
          phone: '',
          email: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          email: '',
          pass:'',
          pd:{padding:'0 18%'},
          code:'',
          cpass:'',
          checkPass:''
        },
        rules: {
          name: [
            {  required: true,validator:checkname ,trigger: 'blur' }
          ],
          phone: [
            { required: true,validator:checkphone, trigger: 'change' }
          ],
          email: [
            { required: true, validator:checkemail, trigger: 'change' }
          ],
          pass: [
            { required: true, message: this.$t('message.string_of_length'), trigger: 'blur' }
          ],
          cpass: [
            { required: true, validator:checkpass, trigger: 'change' }
          ],
          resource: [
            { required: true, message: this.$t('message.select_activity_resources'), trigger: 'change' }
          ],
          desc: [
            { required: true, message: this.$t('message.select_activity_style'), trigger: 'blur' }
          ],
          code:[
          	{ required: true, validator: checkcode, trigger: 'blur' }
          ]
        }
      };
    },
    created(){
      if(window.screen.width==768){
        this.pd = {padding:'0 1%'};
      } else {
        this.pd = {padding:'0 18%'};
      }
    },
    computed: {
    	
    },
    mounted(){
      document.title = this.$t('message.register');
      console.log(window.screen.width)
      
    },
    watch:{
      message(res){
          console.log(res)
      }
    },
    methods: {
      ...mapMutations(['USER_INFO']),
      error(err) {
        this.$message.error(err);
      },
      submitForm(formName) {
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
          	const obj = {};
          	obj.names = this.ruleForm.n;
          	obj.username = this.ruleForm.name;
          	obj.phone = this.ruleForm.phone;
          	obj.vercode = this.ruleForm.code;
          	obj.openid = '';
          	obj.address = this.ruleForm.addr;
          	obj.company = this.ruleForm.company;
          	obj.email = this.ruleForm.email;
          	obj.password = md5(this.ruleForm.pass);
            axios.post('https://nccloud.weihong.com.cn/ncmes/web/register',obj).then(function(res){
            	if(res.data.result=="success"){
                _this.USER_INFO(obj);
            		_this.$router.push({path:'/login'})
            	} else {
                _this.$ssm(res.data)
              }
            }).catch(function(err){
            	console.log(err)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      getCode(formName) {
        this.$refs[formName].validateField("phone",function(errorMessage){
            console.log(errorMessage)
        })
      	const rul = /^1((3[0-9]|4[57]|5[0-35-9]|7[035678]|8[0-9])\d{8}$)/;
      	if(rul.test(this.ruleForm.phone)){
      	  let index = 60;
          this.class="unclick";
          this.message = this.$t('message.resend') +"("+index+")";
          var _this = this;
          var interval = setInterval(
            function(){
              if(index>0){
                index--;
                _this.message = _this.$t('message.resend') +"("+index+")";
              }else{
                clearInterval(interval);
                _this.message = _this.$t("message.get_verification_code_for_free");
                _this.class = ""
              }
            },1000);
        		axios.get('https://nccloud.weihong.com.cn/ncmes/vercode/'+this.ruleForm.phone+"?="+_this.num).then(function(res){
        			console.log(res)
        			if(res.data.result=="success"){
        				_this.num++
        			}else {
								clearInterval(registerInterval);
								_this.message = free_text;
								_this.$ssm(res.data);
								_this.class = "";
							}
        		}).catch(function(err){
							clearInterval(registerInterval);
							_this.message = free_text;
							_this.class = "";
        		})
        	}
      	
      }
    }
  }
</script>
