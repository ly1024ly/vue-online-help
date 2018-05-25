<template>
	<div class="all-content">
		<v-title>{{title}}</v-title>
		<div class="card-content">
			<card  v-for="(item,index) in allMachine" :item="item" :allMqttStatus="allMqttStatus" :key="index" :lang="lang" v-on:deleteCard="deleteCard"></card>
			<el-card class="card-plus"  @click="addMachine()">
      			<el-button type="text" @click="addMachine()"><i class="el-icon-circle-plus" ></i></el-button>
      		</el-card>
		</div>
		<el-dialog :visible.sync="dialog" :style="style" center :title="please_select_the_device_and_content_for_the_newly_added_display_block" @close="cancelButton">
			<el-form :model="form" :rules="rules2" ref="ruleForm2" :label-width="labelWidth">
				<el-form-item :label="select_the_device" prop="equipment" :style="chooseStyle">
    				<el-select v-model="form.equipment" @change = "getContent(form.equipment)" :placeholder="$t('message.please_select_the_device')">
    					<el-option  v-for="(item,index) in equipment" :key="index"  :label="item.label" :value="item.value"  >
    					</el-option>
    				</el-select>
  				</el-form-item>
  				<el-form-item :label="select_the_content" prop="choose" :style="chooseStyle">
    				<el-select 
              v-model="form.choose" 
              no-match-text="false" 
              :no-data-text="$t('message.none')"
            :placeholder="$t('message.please_select_the_content')">
      					<el-option  v-for="(item,index) in chooseCentent"  :key="index" :label="item.value" :value="item.key"  >
      					</el-option>
    				</el-select>
  				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
    		<el-button @click="cancelButton">{{ $t("message.cancel") }}</el-button>
    		<el-button type="primary" @click="getTempletForm">{{ $t("message.ok") }}</el-button>
  		</span>
		</el-dialog>
		<span class="deleteTemp el-icon-delete" @click="deleteTemp"></span>
	</div>
</template>
<style lang="scss" scoped>
@import "../style/templet.scss";
.el-select-dropdown.el-popper{
  display:none;
}
</style>
<script type="text/javascript">
import card from "./templet-card.vue";
import VTitle from "./headline.vue";
import { mapMutations,mapState} from 'vuex';
import NcMqttClient from '../mqtt/mqttEchart.js';
import * as api from '../api/server.js';
import md5 from 'js-md5';
import Cookies from "js-cookie";
export default {
	props:["lang"],
	data() {
		let validatEquipment = (rule, value, callback) => {
		  	if (!value) {
	          return callback(new Error(this.$t('message.please_select_the_device')));
	        }else{
	        	callback();
	    	}
	  	};
	  	let validatChooseCentent = (rule, value, callback) => {
		  	if (!value) {
	          return callback(new Error(this.$t('message.please_select_the_content')));
	        }else{
	        	callback();
	    	}
	  	};
		return {
			allMachine:[],
			dialog:false,
			msg:{},
			equipment:[],
			chooseCentent:[],
			equipmentObj:{},
			chooseCententObj:{},
			innerText:[],
			style:'max-width:900px;min-width:800px;margin:0 auto;',
			labelWidth:'75px',
			form:{
				equipment:'',
				choose:'',
			},
			rules2: {
	          equipment: [
	            { validator: validatEquipment, trigger: 'change' }
	          ],
	          choose: [
	            { validator: validatChooseCentent, trigger: 'change' }
	          ]
        	},
        	name:'',
        	list:[],
        	machineParameterList:[],
        	allMqttStatus:[],
        	mqtts:[],
        	value:'',
        	feedv:[],
        	chooseStyle:'padding-left:13%',
        	title:'',
          displayname:this.$route.params.name
			
		}
	},
	components: {
    	card,
    	VTitle
  	},
	mounted:function(){
		this.getMenu()
    this.reload()
	},
	methods:{
		...mapMutations(['FOCUS_MACHINE','MQTT']),
    getMenu(){
      let name = this.$route.params.name
      let that = this
      api.getTempName()
          .then(res => {
            if(res.data.result=="success"){
              let str =''
              res.data.value.forEach(function(val) {
                  str = str + val.displayname + ','
                  
              })
              if(str.indexOf(name)===-1){
                that.$alert(that.$t('message.the_exhibition_board_has_been_deleted'), that.$t('message.warm_tips'), {
                      confirmButtonText: '确定',
                      callback: action => {
                        window.close()
                      }
                      });
              }
                
            }
             
          })

    },
		reload(){
			let data = {
				displayname: this.$route.params.name
			}
			this.title = this.$route.params.name
			let that = this
			that.allMachine = []
			that.msg = {}
			that.equipment = []
			api.getNewTempMachime(data)
	        .then(res => {
	        	if(res.data.result=="success"){
	        		this.$emit("success","success");
	        		let arr = [];
	            	res.data.value.params.forEach(function(val) {
	            		if(val.param){
	            			//let value = that.changeLanguage(val.param.key)
				          	that.msg = {
				            	alias:val.alias,
				            	uuid:val.uuid,
				            	value:val.param.value,
				            	unit:val.param.unit,
				            	key:val.param.key,

				          	};
				        	that.machineParameterList = val.param;
				  
		          			that.allMachine.push(that.msg);
		          			let obj = {};
			              	obj.uuid = val.uuid;
			              	obj.item = [val.param.key,"WHstatus_ExecState"];
			              	obj.enable = true;
			              	arr.push(obj);
		              	}
	        		});
		            let pass = Cookies.get('password');
		            let username = Cookies.get('username');
		            
		            var productionMqtt = new NcMqttClient(username, pass, function(_1, _2, _3, _4) {
                  let ar = [_1, _2, _3, _4];
                  ar[2] = that.$format(ar[1],ar[2]);
		              that.getData(ar[0],ar[1],ar[2],ar[3]);
		            });

		            let data = that.allMqttStatus

		            productionMqtt.connect(arr)
	        		
	        	}
	        })
	        api.getFocusMachine().then(res=>{
	        	if(res.data.result=="success"){
	        		
	        		res.data.values.forEach(function(val) {
	        			let data = {
	        				label:val.alias,
	        				value:val.uuid,
	        				param:val.item,
	        			}
	        			that.equipment.push(data);	
	        		})
	        	}
	        })
		},
		getData(_1, _2, _3, _4){
			let ar = []
			let _this = this
            ar = [_1, _2, _3, _4];
            
              /*for(var i=0;i<_this.machineParameterList.length;i++){
                if(ar[1]==_this.machineParameterList[i].key){

                  if(_this.innerText.length==0){
                  //如果innerText里面是空
                    let param = {};
                    param.uuid = ar[0];
                    param.data = [];
                    let obj = {
                      status:ar[1],
                      value:ar[2],
                      time:ar[3],
                      alias:_this.machineParameterList[i].value
                    }
                    param.data.push(obj);
                    _this.innerText.push(param); 
                  }else{
                    let flag = true;
                    _this.innerText.forEach(function(val){
                      let flagid = true;
                      if(val.uuid==ar[0]){
                      //判断里面是否有uuid相同的情况
                        flagid = false;
                        flag = false;
                        let flagData = true;
                        let newDataObj = {};
                        let newDataArr = [];
                        val.data.forEach(function(three){
                          if(three.status==ar[1]){
                          //判断status是相同就直接将里面对象替换并放到个新的数组里面
                            flagData = false;
                            newDataObj.status = ar[1];
                            newDataObj.value = ar[2];
                            newDataObj.time = ar[3];
                            newDataObj.alias = _this.machineParameterList[i].value;
                            newDataArr.push(newDataObj)
                          }else{
                          //不同就直接放到新的数组里面,该uuid下新的data数组
                            newDataArr.push(three);
                          }
                        });
                        if(flagData){
                        //该uuid下没有这个status,将uuid的data里push个新对象
                          let o = {
                            status:ar[1],
                            value:ar[2],
                            time:ar[3],
                            alias:_this.machineParameterList[i].value
                          }
                          _this.innerText.forEach(function(one){
                            if(one.uuid==val.uuid){
                              one.data.push(o)
                            }
                          })
                        }else{
                        //该uuid下有status，将uuid的data付值为newDataArr;
                         _this.innerText.forEach(function(two){
                            if(two.uuid==val.uuid){
                              two.data = newDataArr;
                            }
                          })
                        }
                      }
                    });
                    if(flag){
                    //如果没有这个uuid的对象
                      let param = {};
                      param.uuid = ar[0];
                      param.data = [];
                      let newObj = {};
                      newObj.status = ar[1];
                      newObj.value = ar[2];
                      newObj.time = ar[3];
                      newObj.alias = _this.machineParameterList[i].value;
                      param.data.push(newObj);
                      _this.innerText.push(param);
                    }
                  }       
                }
              };

              _this.addParam(_this.machineParameterList)
              _this.innerText.forEach(function(o){
                if(o.uuid==_this.uuid){
                  _this.innerCard = o.data;
                }
              })*/
              //生成allMqttStatus数组
              if(_this.allMqttStatus.length==0){
                let param = {};
                param.uuid = ar[0];
                param.data = [];
                let obj = {
                  status:ar[1],
                  value:ar[2],
                  time:ar[3],
                }
                param.data.push(obj);
                _this.allMqttStatus.push(param);
              }else{
                    let flag = true;
                    _this.allMqttStatus.forEach(function(val){
                      let flagid = true;
                      if(val.uuid==ar[0]){
                      //判断里面是否有uuid相同的情况
                        flagid = false;
                        flag = false;
                        let flagData = true;
                        let newDataObj = {};
                        let newDataArr = [];
                        val.data.forEach(function(three){
                          if(three.status==ar[1]){
                          //判断status是相同就直接将里面对象替换并放到个新的数组里面
                            flagData = false;
                            newDataObj.status = ar[1];
                            newDataObj.value = ar[2];
                            newDataObj.time = ar[3];
                            newDataArr.push(newDataObj)
                          }else{
                          //不同就直接放到新的数组里面,该uuid下新的data数组
                            
                            newDataArr.push(three);
                          }
                        });
                        if(flagData){
                        //该uuid下没有这个status,将uuid的data里push个新对象
                          let o = {
                            status:ar[1],
                            value:ar[2],
                            time:ar[3],
                          }
                          _this.allMqttStatus.forEach(function(one){
                            if(one.uuid==val.uuid){
                              one.data.push(o)
                            }
                          })
                        }else{
                        //该uuid下有status，将uuid的data付值为newDataArr;
                         _this.allMqttStatus.forEach(function(two){
                            if(two.uuid==val.uuid){
                              two.data = newDataArr;
                            }
                          })
                        }
                      }
                    });
                    if(flag){
                    //如果没有这个uuid的对象
                      let param = {};
                      param.uuid = ar[0];
                      param.data = [];
                      let newObj = {};
                      newObj.status = ar[1];
                      newObj.value = ar[2];
                      newObj.time = ar[3];
                      param.data.push(newObj);
                      _this.allMqttStatus.push(param);
                    }

              } 
              console.log(_this.allMqttStatus)
             
              //进给速度
              if(ar[1] == "WHstatus_FeedV"){
                if(_this.feedv.length==0){
                  let feed = {};
                  let obj = {};
                  let arr = [];
                  feed.uuid = ar[0];
                  obj.status = ar[1];
                  obj.value = ar[2];
                  obj.time = ar[3];
                  arr.push(obj);
                  feed.data = arr;
                  _this.feedv.push(feed);
                }else{
                  _this.feedv.forEach(function(val){
                    if(val.uuid == ar[0]){
                      let obj = {};
                      obj.status = ar[1];
                      obj.value = ar[2];
                      obj.time = ar[3];
                      val.data.push(obj)
                    }
                  })
                }
              }  
            _this.mqtts = ar;			

		},
      addParam(arr){
        let that = this;
        this.innerText.forEach(function(it){
          arr.forEach(function(mp){
            if(it.uuid == that.uuid){
              let flag = true;
              it.data.forEach(function(id){
                if(id.status == mp.key){
                  flag = false;
                }
              });
              if(flag&&mp.value!==null){
                let obj = {};
                obj.alias = mp.value;
                obj.status = mp.key;
                obj.time = "";
                obj.value = "";
                it.data.push(obj);
              }
            }
          })
        })
      },
      delParam(key){
        let innerText = this.innerText;
        for(var i in innerText){
          if(innerText[i].uuid = this.uuid){
            let newArr = [];
            innerText[i].data.forEach(function(da){
              if(da.status == key){
                newArr.push(da)
              }
            })
            innerText[i].data = newArr;
          }
        }
      },
		addMachine(){
			this.dialog = true;
			
		},
		getContent(value){
			let data = {
				uuid:value,
			}
			let that = this
			that.chooseCentent = []
			api.homeLists(data).then(res=>{
	        	if(res.data.result=="success"){
	        		res.data.value.forEach(function(val) {
	        			let value = that.getEnByStatuName(val.key)

	        			let data = {
	        				algorithm:val.algorithm,
	        				key:val.key,
	        				type:val.type,
	        				unit:val.unit,
	        				value:value?value:val.value,
	        				_id:val._id,
	        				chValue:val.value
	        			}
	        			that.chooseCentent.push(data);
        			})
	        	}
        	})
		},
		getTempletForm(){
			let that = this
			this.$refs['ruleForm2'].validate((valid) => {
				if(valid){
					let data = {
						displayname:this.$route.params.name,
						params:{
							alias:'',
							param:{},
							uuid:'',
						},
					}
					that.equipment.forEach(function(val) {
						if(val.value == that.form.equipment){
							data.params.alias = val.label
							data.params.uuid = val.value
						}			
					})
					that.chooseCentent.forEach(function(val) {
						if(val.key == that.form.choose){
							data.params.param.algorithm = val.algorithm
							data.params.param.key = val.key
							data.params.param.type = val.type
							data.params.param.unit = val.unit
							data.params.param._id = val._id
							data.params.param.value = val.chValue
						}	
					})
					api.newTempAddMachineOrRmMachine(data).then(res=>{
						if(res.data.result=="success"){
							that.dialog = false;
							that.$message({
								message: that.$t('message.op_success'),
								type: 'success'
							});
							that.reload()
							that.cancelButton()
						}else{
              let error = 'error_no_'+ res.data.errorno
							that.$message({
								message: that.$t('message.'+error),
								type: 'error'
							});
							that.cancelButton()
						}

					})

				}
			})
		},
		cancelButton(){
			this.dialog = false
    		this.form.choose = ''
			this.form.equipment = ''
			this.$refs['ruleForm2'].resetFields();
    	},
		deleteCard(item){
			let data = {
				displayname: this.$route.params.name,
			}
			this.equipment.forEach(function(val) {
				if(val.value == item.uuid){
					data.uuid = item.uuid
					data.param = item.key
				}			
			})
			let that = this
			that.$confirm(that.$t('message.are_you_sure_you_want_to_delete_this_parameter'), that.$t('message.warm_tips'), {
		          confirmButtonText: that.$t('message.ok'),
		          cancelButtonText: that.$t('message.cancel'),
		          type: 'warning',
		          center: true
	        }).then(() => {

	         api.delTempAddMachineOrRmMachine(data).then(res=>{
				if(res.data.result=="success"){
					    that.$message({
		            type: 'success',
		           	message: that.$t('message.delete_success')
	            });
	          	that.reload()
				}else{
              let error = 'error_no_'+ res.data.errorno
					    that.$message({
		            	type: 'error',
		           	 	message: that.$t('message.'+error)
	          	});
				}
			})
	          
	   },()=>{})
			

		},
		deleteTemp(){
			let data = {
				displayname: this.$route.params.name,
			}
			let url = window.location.href;
			let len = url.length
			let index = url.lastIndexOf("#");
			let openU = url.slice(0,index);
			let that = this
      
			that.$confirm(that.$t('message.do_you_want_to_delete_this_board'), that.$t('message.warm_tips'), {
		          confirmButtonText: that.$t('message.ok'),
		          cancelButtonText: that.$t('message.cancel'),
		          type: 'warning',
		          center: true
	        }).then(() => {
	        	api.deleteTemp(data).then(res=>{
    					if(res.data.result=="success"){	
    						that.$message({
    			         type: 'success',
    			         message: that.$t('message.delete_success')
    	          });
                window.close()
    					}else{
                let error = 'error_no_'+ res.data.errorno
    						that.$message({
    		            		type: 'error',
    		           	 		message: that.$t('message.'+error)
    	          			});

    					}
				})

	        },()=>{})
			

		},
		getEnByStatuName(name){
			
			if(this.lang =='English' )
      		return this.$t('message.'+ name);
    	},
	},
	computed: {
		select_the_device:function(){
			return this.$t("message.select_the_device")
		},
		select_the_content:function(){
			return this.$t("message.select_the_content")
		},
		please_select_the_device_and_content_for_the_newly_added_display_block:function(){
			return this.$t("message.please_select_the_device_and_content_for_the_newly_added_display_block")
		},
		

	},
	watch: {
		uuid:function(val){
	        let obj = {};
	        obj.username = Cookies.get('username');
	        obj.uuid = val;
	        obj.openid = Cookies.get('openid');
	        obj.token = Cookies.get('token');
	        this.getMachineData(obj);
	        this.uuid = val;
	        if(!this.uuid){
	          this.uuid = this.$route.query.uuid;
	        }
	        var that = this;
	        this.innerText.forEach(function(o){
	          if(o.uuid==that.uuid){
	            that.innerCard = o.data;
	          }
	        })
	        this.allmachinedropList({uuid:this.uuid})
      	},
	    name(val) {
	    	console.log(val);
	 	},
	 	machineParameterList:function(val){
	        let that = this;
	        console.log(val)
	        /*if(val){
		        val.forEach(function(a){
		          if(a.value!==null){
		            that.delParam(a.key)
		          }
		        })
	        }*/
        },
        lang:function(val){
        	console.log(val)
        	if(val =='English'){
        		this.style = 'max-width:1080px;min-width:860px;margin:0 auto;'
        		this.labelWidth = '135px'
        		if(window.screen.width <=768){
        			this.chooseStyle = 'padding-left:3%'
        		}
        	}else{
        		this.style = 'max-width:900px;min-width:800px;margin:0 auto;';
        		this.labelWidth = '75px'
        	}

        },
        

  }
}
</script>