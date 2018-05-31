<template>
  <div class="profile">
    <div>
      <el-dialog
        title="分享"
        :visible.sync="DialogVisible"
        width="30%"
        center>
        <div v-show="sharemy">
          <p>您可以用以下信息的任意一种向他人分享资料：</p><div>手册号：{{mybookcode}}</div><div>分享码：{{mycode}}</div><div>分享链接：{{mybooklink}}</div><div>分享链接二维码：</div><p class="qrcode" style="text-align:center"><canvas id="canvas" ref="canvas"></canvas></p>
          <div slot="footer" class="dialog-footer">
            <el-button @click="DialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="DialogVisible = false">确 定</el-button>
          </div>
        </div>
        <div v-show="check">
            <p>请输入手册号或分享码（保密资料只能通过分享码添加）</p>
            <select class="type" @change="checkway">
              <option value="code">分享码</option>
              <option value="phone">手机号</option>
            </select>
            <input type="text" v-model="sharecode" style="height:23px"/>
            <button type="warning" @click='this.checksharecode'>检测</button>
            <p class="description">
              <div>{{this.$t('message.popmessage')}}</div>
              <ul>
                <li>厂商：{{obj.manufacturer}}</li>
                <li>品牌：{{obj.brand}}</li>
                <li>型号：</li>

              </ul>
            </p>
            <div slot="footer" class="dialog-footer">
              <el-button >取 消</el-button>
              <el-button type="primary" @click="add">确 定</el-button>
            </div>
          </div>
      </el-dialog>
      <el-button type="primary" @click="open5">{{this.$t('message.addfile')}}</el-button>
      <router-link to="/files"><el-button type="primary">{{this.$t('message.browse')}}</el-button></router-link>
    </div>
    <div class="content">
      <div class="tree">
        <div><i class="el-icon-document" />&nbsp;全部资料</div>
        <ul>
          <li v-for="(item,index) in books" keys="index" @click="openpage(item.html)" :class="item.status=='上线' ? '': 'notouch'" >
            <a class="attr" :title="item.secrecy_type" >
            <div class="row"><i class="el-icon-document" />&nbsp;{{item.title.slice(0,9)}}</div><el-button type="primary" icon="el-icon-delete" @click="del(item)" class="delete"></el-button><el-button type="primary" icon="el-icon-share" @click="share(item)"></el-button>
            </a>
          </li>
        </ul>
      </div>
      <div class="detail" ref="detail" :style="{width:width}" v-html="content">
        
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>

@import '../style/myprofile.scss'
</style>
<style lang="scss">

  .type{
    width:20%;
    padding:5px 15px;
    vertical-align:top;
  }
  .el-message-box {
    input{
      padding:5px 15px;
      vertical-align:top;
    }
    button{
      padding:4px 15px;
    }
    .description{
      padding:10px 0px;
      text-align:center;
    }
  }
  .dialog-footer{
    text-align:center;
  }
</style>

<script type="text/javascript">
import * as api from '../api/server.js';
import Cookies from 'js-cookie'
var QRCode = require('qrcode')
  export default{
    data(){ 
      return {
        books:[],
        DialogVisible:false,
        width:document.body.clientWidth * (1008/1680) + "px",
        openurl:'',
        mybookcode:'',
        mybooklink:'',
        mycode:'',
        sharecode:'',
        content:"",
        sharemy:false,
        check:false,
        checktype:'code',
        obj:{}
      }
      
    },
    mounted(){
      this.$emit("success","success");
      api.getmycollect({username:Cookies.get('username')}).then(res => {
        console.log(res)
        if(res.data.result == "success"){
          console.log(res.data.value);
          this.books = res.data.value;
          
        } else {
          this.$ssm(res.data)
        }
      })
      window.onresize = () => this.resize()
    },
    computed:{
      li_style(val){
        console.log(val)
        return {}
      }
    },
    methods:{
      resize(){
        this.width = document.body.clientWidth * (920/1680) + "px"
        console.log(document.body.clientWidth)
      },
      checkway(val){
        this.checktype = val
      },
      add(){
        api.addmycollect(this.obj).then(res => {
          if(res.data.result == "success"){
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.books.push(this.obj)
            this.DialogVisible = false;
          } else {
            this.$ssm(res.data)
          }
        })
      },
      share(par){
        this.DialogVisible = true;
        this.mybookcode = par.ID;
        this.mybooklink = par.link;
        this.mycode = par.sharecode;
        this.sharemy = true;
        this.check = false;
        setTimeout(function(){
          if(par.link){
          var canvas = document.getElementById("canvas");
          QRCode.toCanvas(canvas, par.link, function (error) {
          if (error) console.error(error)
            console.log('success!');
          })
        }
        },100)
      },
      del(par){
        console.log(par);
        api.deletefile({username:Cookies.get('username'),ID:par.ID}).then(res => {
          if(res.data.result == "success"){
            let result = this.books.filter(er => {
              return er.ID !== par.ID
            })
            this.books = result
          } else {
            this.$ssm(res.data)
          }
        })
      },
      openpage(res){
        console.log(res)
        this.content = res;
      },
      checksharecode(){
        console.log(this.sharecode)
        if(this.checktype == "code"){
          api.checksharecode({sharecode:this.sharecode}).then(res => {
            if(res.data.result == "success"){
              this.obj = res.data.value
            } else {
              this.$ssm(res.data)
            }
          })
        }
      },
      open5() {
        this.DialogVisible = true;
        this.sharemy = false;
        this.check = true;
      }
      
      
    }
  }
</script>