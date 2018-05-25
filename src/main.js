require('es6-promise').polyfill()
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import store from './store'
import App from './App.vue'
import routes from './router.config'
import echarts from 'echarts'
import ServerLang from './util/ServerLang'
import Cookies from 'js-cookie'
import auth from './auth.config'
import { quillEditor } from 'vue-quill-editor'
const router = new VueRouter(routes)
Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(VueI18n);
Vue.use(ServerLang); 
Vue.use(quillEditor);
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.prototype.$echarts = echarts


const i18n = new VueI18n({
  locale:'zh-CN',
  messages:{
    'zh-CN':require('./i18n/lang/cn.js'),
    'zh-US':require('./i18n/lang/en.js')
  }
});

//导航过滤
router.beforeEach((to, from, next) => {
  if(from.path === '/login'){
    next(false);
  }
  let unpass = auth.some((item)=>{
   return to.path === item
  })
  if(!unpass){
    let username = Cookies.get("username");
    let pass = Cookies.get("password");
    let token = Cookies.get("token");
    if(!(username&&pass&&token)){
      router.push({path:'/login'})
    }else{
      next();
    }
  }else{
    next();
  }
})


export default i18n;

new Vue({
  	el: '#app',
  	store,
  	router,
    i18n:i18n,
    components:{
    	"v-app":App
    }
});