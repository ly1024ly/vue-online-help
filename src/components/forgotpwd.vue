<template>
	<div class="forgotpwd">
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
			<p>{{$t('message.forgotpwd')}}</p>
			<el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="150px" class="demo-ruleForm">
				<el-form-item :label='$t("message.phone")' prop="phone">
				    <el-input type="phone" v-model="ruleForm2.phone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item :label='$t("message.new_password")' prop="pass">
				    <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item :label="$t('message.confirm_password')" prop="cpass">
				    <el-input type="password" v-model="ruleForm2.cpass" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item :label='this.$t("message.verification_code")' prop="age" class="lcode">
				    <el-input  v-model="ruleForm2.age"></el-input>
				    <label class="getCode" :class="this.class" @click="getCode('ruleForm2')" v-model="ruleForm2.phone">{{message}}</label>
				</el-form-item>
				<el-form-item>
				    <el-button type="primary" @click="submitForm('ruleForm2')">{{ $t("message.submit") }}</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<style lang="scss" scoped>
@import "../style/forgotpwd.scss";
</style>
<script>
import * as api from "../api/server.js";
import { mapState, mapGetters, mapMutations } from "vuex";
import axios from "axios";
import md5 from "js-md5";
import Cookies from "js-cookie";
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      const rul = /^\d{6,6}$/;
      let flag = rul.test(value);
      if (!value) {
        return callback(
          new Error(this.$t("message.verification_code_must_be_filled"))
        );
      } else if (!flag) {
        callback(new Error(this.$t("message.verification_code_dight_alert")));
      } else {
        callback();
      }
    };
    var checkphone = (rule, value, callback) => {
      const rul = /^1((3[0-9]|4[57]|5[0-35-9]|7[035678]|8[0-9])\d{8}$)/;
      let flag = rul.test(value);
      if (value === "") {
        callback(new Error(this.$t("message.phonenum_not_null")));
      } else if (!flag) {
        callback(new Error(this.$t("message.phonenum_ruler_alert")));
      } else {
        callback();
      }
    };
    var checkpass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("message.enter_your_password_again")));
      } else if (value !== this.ruleForm2.pass) {
        callback(
          new Error(this.$t("message.inconsistent_password_entry_twice"))
        );
      } else {
        callback();
      }
    };
    return {
      class: "",
      num: 1,
      loginlan: "Language",
      cn: "zh-CN",
      en: "zh-US",
      message: this.$t("message.get_verification_code_for_free"),
      ruleForm2: {
        phone: "",
        pass: "",
        cpass: "",
        age: ""
      },
      rules2: {
        phone: [{ required: true, validator: checkphone, trigger: "blur" }],
        pass: [
          {
            required: true,
            message: this.$t("message.string_of_length"),
            trigger: "blur"
          }
        ],
        cpass: [{ required: true, validator: checkpass, trigger: "change" }],
        age: [{ validator: checkAge, trigger: "blur" }]
      }
    };
  },
  mounted() {
    let lang = Cookies.get("locale");

    if (lang === undefined || lang == "zh-CN") {
      this.language = "Language";
      this.$i18n.locale = "zh-CN";
    } else {
      this.language = "English";
      this.$i18n.locale = "zh-US";
    }
    //刷新语言
    this.message = this.$t("message.get_verification_code_for_free");
    this.$set(this.rules2.pass[0], 'message', this.$t("message.string_of_length"));
    document.title = this.$t("message." + this.$route.name);
  },
  updated() {
    document.title = this.$t("message." + this.$route.name);
  },
  created() {},
  computed: {},
  watch: {
    loginlan(res) {
      this.account = this.$t("message.account");
      this.password = this.$t("message.password");
      this.verification_code = this.$t("message.verification_code");
      this.message = this.$t("message.get_verification_code_for_free");
    }
  },
  methods: {
    changeLang(command) {
      this.$i18n.locale = command;
      Cookies.set("locale", command);
      if (command == "zh-CN") {
        this.loginlan = "中文";
      } else {
        this.loginlan = "English";
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        var _this = this;
        if (valid) {
          const obj = {};
          obj.phone = this.ruleForm2.phone;
          obj.newpassword =  md5(this.ruleForm2.pass);
          obj.vercode = this.ruleForm2.age.toString();
          api
            .forgetPwd(obj)
            .then(function(res) {
              if (res.data.result == "success") {
                _this.$router.push({ path: "/login" });
              } else {
                _this.$ssm(res.data);
              }
            })
            .catch(function(err) {});
        } else {
          return false;
        }
      });
    },
    setCookies(obj) {
      var day = new Date();
      var str = "";
      day.setTime(day.getTime() + 7 * 24 * 60 * 60 * 1000);
      for (var key in obj) {
        Cookies.set(key, obj[key], { expires: 7 });
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getCode(formName) {
      this.$refs[formName].validateField("phone", function(errorMessage) {
        console.log(errorMessage);
      });

      const rul = /^1((3[0-9]|4[57]|5[0-35-9]|7[035678]|8[0-9])\d{8}$)/;
      if (rul.test(this.ruleForm2.phone)) {
        let index = 60;
        let text = this.$t("message.resend");
        let free_text = this.$t("message.get_verification_code_for_free");
        this.class = "unclick";
        this.message = text + "(" + index + ")";
        var _this = this;
        var interval = setInterval(function() {
          if (index > 0) {
            index--;
            _this.message = text + "(" + index + ")";
          } else {
            clearInterval(interval);
            _this.message = free_text;
            _this.class = "";
          }
        }, 1000);
        let pam = {};
        pam.phone = this.ruleForm2.phone;
        pam.num = this.num;
        api
          .vercodeAjax(pam)
          .then(function(res) {
            if (res.data.result == "success") {
              _this.$message.success(_this.$t("message.send_successfully"));
            } else {
              _this.$ssm(res.data);
              clearInterval(interval);
              _this.message = free_text;
              _this.class = "";
            }
          })
          .catch(function(err) {
            clearInterval(interval);
            _this.message = free_text;
            _this.class = "";
          });
      }
    }
  }
};
</script>