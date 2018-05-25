import {showSucess, showError, showServerError} from './MessageDeal.js';


let ServerLang = {}

//Vue的插件编写 需要为插件编写install属性，类型为方法。其中可以编写全局方法，mixin,
//自定义指令，以及实例方法
ServerLang.install = function (Vue, options) {
    // 1. 添加全局方法或属性
    Vue.myGlobalMethod = function () {
      // 逻辑...
    }

    //根据后端返回的key 进行转译出对应的语言字段
    Vue.prototype.$sl = function (key) {
      return key ?  this.$t('message.'+ key) : '';
    }
    //根据后端返回的错误数据返回对应的错误提示
    Vue.prototype.$ssm = function (data) {
      showServerError(data,this)
    }
    //处理时间的方法
    var feedVSstyle = function(msg) {
      var t = msg + " ";
      var t1 = t.indexOf(".");
      if (t1 == -1) {
        t1 = t.length;
      }
      var a = t.substr(0, t1);
      return a;
    }

    var secondToDate = function(result) {
      var h = Math.floor(result / 3600)==0 ? "0"+":" : Math.floor(result / 3600) + ":";
      var m = Math.floor((result / 60 % 60))==0 ? "0"+":" : Math.floor((result / 60 % 60)) + ":";
      var s = Math.floor((result % 60));
      result = (h.length>=3 ? h : "0"+h) +  (m.length>=3 ? m : "0"+m) + (s>=10 ? s : "0"+s);
      return result
    }
    //格式化数据，给值添加单位
    Vue.prototype.$format = function(ar1,ar2) {
      let rule = JSON.parse(sessionStorage.getItem("formatTime"));
      let match = rule.filter(val => {
        return val.key == ar1
      })
      match = match[0];
      if(match&&(match.type=="time")||match&&(match.type == "time_wear")){
        
        let time = secondToDate(ar2);
        
        return time
      } else if(ar1 == "WHstatus_Efficiency") {

        return ar2
      } else if(ar1 == "WHstatus_HadCompletedPercent"){
        return Number(ar2).toFixed(2)
      } else if(ar1 == "WHstatus_FeedV"){
        return ar2 + " " +match.unit
      }else {

        return match ? (ar2+" " +match.unit).trim() : ar2
      }

    }

  }


  export default  ServerLang;