<template>
	<div>
		<div class="card-box">
			<el-card>

				<span class='delete-card el-icon-remove' @click="deleteCard(item)"></span>
				<div  v-for="(its,indexs) in allMqttStatus" :key="indexs+'2'">
		          <div v-for="(it,indexs) in its.data" v-if="its.uuid==item.uuid">
		          	<div v-if="it.value=='Running'&&it.status=='WHstatus_ExecState'" class="star">
		          		<span  :style="{background:'green'}" class="status-circle"></span>
		          	</div>
		          	<div v-else-if="it.value=='Idle'&&it.status=='WHstatus_ExecState'" class="star">
		          		<span  :style="{background:'#FFD900'}" class="status-circle"></span>
		          	</div>
		          	<div v-else-if="it.value=='Estop'&&it.status=='WHstatus_ExecState'" class="star">
		          		<span  :style="{background:'red'}" class="status-circle"></span>
		          	</div>
		          	<div v-else-if="it.status=='WHstatus_ExecState'" class="star">
		          		<span  :style="{background:'gray'}" class="status-circle"></span>
		          	</div>
		          </div>
        		</div>
				<div class="card-alias-name">{{item.alias}}</div>
				<div class="uuid">{{item.uuid}}</div>
				<div class="pres">{{lang=='English' ? getEnByStatuName(item.key) : item.value}}</div>
				<div class="val" v-for="(its,indexs) in allMqttStatus"  :key="indexs" v-if="its.uuid==item.uuid">
					<div v-for="(it,indexs) in its.data">
						<div v-if="item.key==it.status" v-text:msg="it.value"></div>	
					</div>
				</div>
			</el-card>
		</div>
	</div>
</template>
<style lang="scss" scoped>
@import "../style/templet-card.scss";
</style>
<script type="text/javascript">
export default {
	props: [
	    "item",
	    "allMqttStatus",
	    "lang"
  	],
	data() {
		return {
			allshow:false,
			msg: "",
		}
	},
	watch: {
		lang:function(val){
			//console.log(val)
		}
	},
	mounted(){
		//console.log(this.allMqttStatus)

	},
	computed: {
		
	},
	methods: {
	    getEnByStatuName(name){
	       return this.$t('message.'+ name);
	    },
		deleteCard(item) {
	        this.$emit("deleteCard", item);
    	},
    	running(it) {
      		var reg = /^[0-9]+.?[0-9]*$/;
      		let result = reg.test(it.value);
		    if ((it.value == "Running" && it.status == "WHstatus_ExecState") ||result) {
		        return true;
		    }
		},
		cilcle(it, item) {
      		if (this.mqtuuid && it.uuid == item.uuid && this.allshow == false) {
        		return true;
      		}
   		 },
   		textVal(param) {
	      let name = param.status;
	      let value = param.value;
	      let time = param.time || param.value;
	      let val;
		    /*if(name == "WHstatus_FeedV") {
		    	if (time) {
          			val = this.feedVSstyle(value) + "  mm/min";
       		    }
		    	val = value + "  mm/min";
			} else if(name == "WHstatus_programName") {
				if(value == '') {
					val = '****'
				} else {
					//截取加工文件
					var cncname = value.substr(value.lastIndexOf('\\') + 1);
					val = '****'
				}
			} else if(name == "WHstatus_SpindleFeedrate") {
				val = value + " %";
			} else if(name == "WHstatus_TotalCompletedCount") {
				val = value + " 件";
			} else if(name == "WHstatus_SpindleSpeed") {
				val = value + "  rpm";
			} else if(name == "WHstatus_HadCompletedPercent") {
				val = value + "  %";
			} else if(name == "WHstatus_FeedRate") {
				val = value + "  %";
			} else if(name == "WHstatus_ControllerMode") {
				val = value + "  %";
			}*/
		  var i = parseFloat(value);
		  if(isNaN(i)) {
			  value = value;
		  } else {
			  value = i;
		  }
	      if (name == "WHstatus_TotalCompletedCount") {
	        val = value + this.$t('message.pieces');
	      } else if (name == "WHstatus_ControllerMode") {
	        val = value + "  %";;
	      } else if (name == "WHstatus_FeedV") {
	        if (time) {
	          val = this.feedVSstyle(value) + "  mm/min";
	        }
	      } else if (name == "WHstatus_SpindleFeedrate") {
	        val = value + " %";
	      } else if (name == "WHstatus_SpindleSpeed") {
	        val = value + "  rpm";
	      } else if (name == "WHstatus_FeedRate") {
	        val = value + "  %";
	      } else if (name == "WHstatus_HadCompletedPercent") {
	        val = value + "  %";
	      } else if (name == "WHstatus_programName") {
	        if (value == "" || time.value == "") {
	          val = "****";
	        } else {
	          //截取加工文件
	          var cncname = value.substr(value.lastIndexOf("\\") + 1);
	          val = cncname;
	        }
	      } else if (name == "WHstatus_ExecState") {
	        if (value == "Running") {
	          val = this.$t('message.running');
	        } else if (value == "Idle") {
	          val = this.$t('message.idle');
	        } else if (value == "Estop") {
	          val = this.$t('message.estop');
	        } else {
	        }
	      } else if (name == "WHstatus_Timeline") {
	      } else if (name == "WHstatus_Efficiency") {
	        //echarts
	        var todayTimeSum = 0;
	        if (value !== null && value) {
	        }
	      } else if (name == "WHstatus_Error") {
	      } else if (value == "" || time == "") {
	        val = "****";
	      } else{
	      	val = value;
	      }
	      return val;
	    },
	    feedVSstyle(msg) {
	      var t = msg * 60 + " ";
	      var t1 = t.indexOf(".");
	      if (t1 == -1) {
	        t1 = t.length;
	      }
	      var a = t.substr(0, t1);
	      return a;
    	},

	}
}
</script>