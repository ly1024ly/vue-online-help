import Home from './components/home.vue';
import Warning from './components/warning.vue';
import Register from './components/register.vue';
import Login from './components/login.vue';
import Production from './components/productionMonit.vue';
import Detail from './components/detail.vue';
import Card from './components/card.vue';
import AllMachine from './components/AllMachine.vue';
import Template from './components/template.vue';
import Item from './components/item.vue';
import IntelligentAlarm from './components/IntelligentAlarm.vue';
import Userinfo from './components/userinfo.vue';
import Templet from './components/templet.vue';
import ForgotPwd from './components/forgotpwd.vue';
import MyProfile from './components/MyProfile.vue';
import DataBase from './components/DataBase.vue';
import Publish from './components/Publish.vue';
import PublishFile from './components/publishFiles.vue';



const routes =[
	{
		path:'/',
		component:Home,
		children:[
			{path:'/warning',component:Warning,name:"MESSAGE_ALARM"},
			{
				path:'/production',
				component:Production,
				children:[
					{path:'/card',component:Card}
				],
				name:'Production_Monitoring'
			},
			{path:'/detail',component:Detail,name:'MACGINE_DETAIL'},
			{path:'/template',
				component:Template,
				name:"NEW_BUILDTEMPLATE"
			},
			{path:'/allmachine',component:AllMachine,name:'All_EQUIPMENT'},
			{path:'/intelligentalarm',component:IntelligentAlarm,name:'INTELLIGENT_ALARM'},
			{path:'/userinfo',component:Userinfo,name:"USERINFO"},
			{path:'/templet/:name',component:Templet,name:"name"},
			{path:'/file',component:MyProfile},
			{path:'/files',component:DataBase},
			{path:'/publish',component:Publish},
			{path:'/published',component:PublishFile}

		]
	},
	{
		path:'/register',
		name:'register',
		component:Register
	},{
		path:'/login',
		name:'login',
		component:Login
	},{
		path:'/forgotpwd',
		name:'forgotpwd',
		component:ForgotPwd
	}
];


export default {routes}