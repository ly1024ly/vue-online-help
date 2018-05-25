<template>
    <div>
    	<div class="userinfo" id="userinfo" v-if="show">
    		<el-tabs type="border-card">
    			<el-tab-pane :label="personal_information">
    				<div class="update-info">
    					<el-form :model="ruleForm" status-icon ref="ruleForm" :label-width="label_width" class="demo-ruleForm">
    						<el-form-item :label="name" prop="names">
        						<el-input v-model.trim="ruleForm.names"  :placeholder="please_enter_your_name"></el-input>
      						</el-form-item>
      						<el-form-item :label="username" prop="username">
        						<el-input v-model.trim="ruleForm.username":disabled="true"></el-input>
      						</el-form-item>
      						<el-form-item :label="phone" prop="phone">
        						<el-input v-model.trim="ruleForm.phone" :disabled="true"></el-input>
      						</el-form-item>
      						<el-form-item :label="company_name" prop="company">
        						<el-input v-model.trim="ruleForm.company" :placeholder="please_enter_your_company_name"></el-input>
      						</el-form-item>
      						<el-form-item :label="address" prop="address">
        						<el-input v-model.trim="ruleForm.address" :placeholder="please_enter_your_address"></el-input>
      						</el-form-item>
      						<el-form-item :label="email" prop="email">
        						<el-input v-model.trim="ruleForm.email" :placeholder="please_enter_your_email"></el-input>
      						</el-form-item>
    					</el-form>
    					<div class="update-info-button">
    						<el-button type="primary" plain @click="submitInfo()">{{this.$t("message.submit")}}</el-button>
    					</div>
    				</div>
    			</el-tab-pane>
    			<el-tab-pane :label="modify_password">
    				<div class="update-code">
    					<el-form :model="passwordForm" status-icon ref="passwordForm" :rules="rules" :label-width="label_width" class="demo-ruleForm">
    						<el-form-item :label="old_password" prop="oldpwd">
        						<el-input v-model.trim="passwordForm.oldpwd" type="password"></el-input>
      						</el-form-item>
      						<el-form-item :label="phone" prop="phone">
        						<el-input v-model.trim="passwordForm.phone":disabled="true"></el-input>
      						</el-form-item>
      						<div class="info-box">
    	  						<el-form-item :label="verification_code" prop="code">
    	    						<el-input v-model.trim="passwordForm.code" ></el-input>
    	  						</el-form-item>
    	  						<span class="input-second" v-show="secondText">{{this.$t("message.send_again")}}({{second}})</span>
    					    	<span class="getCode" @click="getCode()" v-show="codeText">{{this.$t("message.get_code")}}</span>
      						</div>
      						<el-form-item :label="new_password" prop="newpwd">
        						<el-input v-model.trim="passwordForm.newpwd" type="password"></el-input>
      						</el-form-item>
      						<el-form-item :label="new_password" prop="newpwd2">
        						<el-input v-model.trim="passwordForm.newpwd2" type="password"></el-input>
      						</el-form-item>
    					</el-form>
    					<div class="update-info-button">
    						<el-button type="primary" plain @click="submitCode()">{{this.$t("message.submit")}}</el-button>
    					</div>
    				</div>
    			</el-tab-pane>
    		</el-tabs>
    		
    	</div>
    </div>
</template>

<style lang="scss" scoped>
@import '../style/userinfo.scss';
</style>

<script type="text/javascript">
import * as api from '../api/server.js';
import {mapState, mapGetters,mapMutations} from 'vuex'
import md5 from 'js-md5';
import Cookies from "js-cookie";
export default {
	data() {
	  let validateOldpwd = (rule, value, callback) => {
	  	
	  	if (!value) {
          return callback(new Error(this.$t("message.please_input_a_password")));
        }else if(value.length<6){
        	callback(new Error(this.$t("message.the_password_length_should_not_be_less_than_6_characters")));
        }else{
        	callback();
        }
	  };
	  let validateCode = (rule, value, callback) => {
	  	const rul = /^\d{6,6}$/;
    	let flag = rul.test(value);
	  	if (!value) {
          return callback(new Error(this.$t("message.please_enter_the_verification_code")));
        }else if(!flag){
        	callback(new Error(this.$t("message.please_enter_6_digit_authentication_codes")));
        }else{
        	callback();
        }
	  };
	  let validateNewpwd = (rule, value, callback) => {
	  	
	  	if (!value) {
          return callback(new Error(this.$t("message.please_input_a_password")));
        }else if(value.length<6){
        	callback(new Error(this.$t("message.the_password_length_should_not_be_less_than_6_characters")));
        }else{
        	callback();
        }
	  };
	  let validateNewpwd2 = (rule, value, callback) => {
	  	if (!value) {
          return callback(new Error(this.$t("message.please_input_a_password")));
        }else if (value !== this.passwordForm.newpwd) {
          	callback(new Error(this.$t("message.two_passwords_are_not_the_same")));
        }else{
        	callback();
        }
	  };
	  var oo = Cookies.get('locale');
      return {
      	ruleForm: {
          names: '',
          username: '',
          phone: '',
          company:'',
          address:'',
          email:''
        },
        passwordForm: {
        	oldpwd:'',
        	phone:'',
        	code:'',
        	newpwd:'',
        	newpwd2:'',
        },
        rules: {
        	oldpwd: [
        		{ validator: validateOldpwd, trigger: 'change' }
          	],
        	code: [
        		{ validator: validateCode, trigger: 'change' }
          	],
	        newpwd: [
	        	{ validator: validateNewpwd, trigger: 'change' }
	        ],
          	newpwd2: [
          		{ validator: validateNewpwd2, trigger: 'change' }
          	]

        },
        lan:'',
        num:1,
        second:60,
        secondText:false,
        codeText:true,
        timer:null,
        show:false
      }
    },
    created(){
    },
    computed: {
        name:function () {
        	return this.$t("message.name")
        },
        username:function () {
        	return this.$t("message.username")
        },
        phone:function () {
        	return this.$t("message.phone")
        },
        company_name:function () {
        	return this.$t("message.company_name")
        },
        address:function () {
        	return this.$t("message.address")
        },
        personal_information:function () {
        	return this.$t("message.personal_information")
        },
        modify_password:function () {
        	return this.$t("message.modify_password")
        },
        old_password:function () {
        	return this.$t("message.old_password")
        },
        new_password:function () {
        	return this.$t("message.new_password")
        },
        email:function () {
        	return this.$t("message.email")
        },
        verification_code:function () {
        	return this.$t("message.verification_code")
        },
        please_enter_your_name:function () {
        	return this.$t("message.please_enter_your_name")
        },
        please_enter_your_company_name:function () {
        	return this.$t("message.please_enter_your_company_name")
        },
        please_enter_your_address:function () {
        	return this.$t("message.please_enter_your_address")
        },
        please_enter_your_email:function () {
        	return this.$t("message.please_enter_your_email")
        },
        label_width:function(){
        	let label 
			let reg = new RegExp("^[a-zA-Z]+$");
			if (reg.test(this.$t("message.name"))){
				label='165px';
			}else{
				label = '80px';
			}
        	return label
        }
    },
    updated(){
    },
    mounted(){
    	console.log('232')
    	api.userData()
        .then(res => {
            console.log(res)
        	if(res.data.result=="success"){
            	this.$emit("success","success");
                this.show = true
            	this.ruleForm = res.data.value;
            	this.passwordForm.phone = res.data.value.phone;
        	}
        })
    },
    watch: {
    	lan(o,k){
    		console.log(o);
    	}
    	
    },
    methods:{
    	
    	submitInfo(){
            let codereg = /^([a-zA-Z0-9_-]{1,16})@([a-zA-Z0-9]{1,9})(\.[a-zA-Z0-9]{1,9}){0,3}(\.(?:com|net|org|edu|gov|mil|cn|us)){1,4}$/;
            let result = codereg.test(this.ruleForm.email);
            if(!result){
                this.$message.error(this.$t("message.email_ruler_alert"));
                return
            }
            let user = {
                names : this.ruleForm.names,
                company : this.ruleForm.company,
                address : this.ruleForm.address,
                email : this.ruleForm.email,
            };
    		let _that = this;
    		console.log(user);
    		api.modifyUserData(user)
				.then(function(res){
					console.log(res);
					if(res.data.result=="success"){
						_that.$message({
							message: _that.$t("message.update_success"),
							type: 'success'
						});
					}else{
						let error = 'error_no_'+ res.data.errorno
                        _that.$message({
                            message: _that.$t('message.'+error),
                            type: 'error'
                        });
					}
				})
    	},
    	submitCode(){
    		let data = {
    			username: this.ruleForm.username,
				password: md5(this.passwordForm.oldpwd),
				phone: this.passwordForm.phone,
				newpassword: md5(this.passwordForm.newpwd),
				vercode: this.passwordForm.code
    		}
    		let _that = this;
    		this.$refs['passwordForm'].validate((valid) => {
    			if(valid){
	    			api.modifyPwd(data).then(function(res){
	    				console.log(res);
	    				if(res.data.result=="success"){
							_that.$message({
								message: _that.$t("message.update_success"),
								type: 'success'
							});
                            Cookies.remove("openid");
                            Cookies.remove("password");
                            Cookies.remove("token");
                            Cookies.remove("username");
                            Cookies.remove("vercode");
                            delete sessionStorage.ErrorMsg;
                            var url = window.location.href;
                            var index = url.lastIndexOf("#");
                            var openU = url.slice(0, index);
                            setTimeout(function(){
                                window.open(openU + "#/login","_self");
                            },2000)
						}else{
                            let error = 'error_no_'+ res.data.errorno
                            _that.$message({
                                message: _that.$t('message.'+error),
                                type: 'error'
                            });
						}
	    			})
    			}

    		})
    		
    	},
    	getCode(){
    		if(this.passwordForm.phone){
    			let data = {
    				phone:this.passwordForm.phone,
    				num:this.num
    			}
    			let _that = this;
    			api.vercodeAjax(data).then(function(res){
    				if(res.data.result=="success"){
    					_that.num++;
    					_that.codeText = false;
		    			_that.secondText = true;
		    			_that.secondReduce(); 
    				}else{
    					let error = 'error_no_'+ res.data.errorno
                        _that.$message({
                            message: _that.$t('message.'+error),
                            type: 'error'
                        });
    				}
    			})
    			  			
    		}
    	},
    	secondReduce(){
    		this.timer = setInterval(()=>{
    			if(this.second){
					this.second--;
	    		}else{
	    			this.codeText = true;
	    			this.secondText = false;
	    			this.second = 60;
	    			clearInterval(this.timer);
	    			this.timer = null;
	    		}

    		},1000)
    		
    	}

    }
}
</script>