<template>
  <div class="published">
    <el-dialog
        title="分享"
        :visible.sync="Visible"
        width="30%"
        center>
        <div>
          <p>您可以用以下信息的任意一种向他人分享资料：</p><div>手册号：{{pubbookcode}}</div><div>分享码：{{this.sharecode1}}</div><div>分享链接：{{pubbooklink}}</div><div>分享链接二维码：</div><p class="qrcode" style="text-align:center"><canvas id="canvas" ref="canvas"></canvas></p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="Visible = false">取 消</el-button>
          <el-button type="primary" @click="Visible = false">确 定</el-button>
        </span>
      </el-dialog>
    <el-button type="primary" icon="el-icon-sort-up" @click="online">上线</el-button>
    <el-button type="primary" icon="el-icon-sort-down" @click="offline">下线</el-button>
    <el-button type="primary" icon="el-icon-delete" @click="deleteMore">删除</el-button>
    <router-link to="publish"><el-button type="primary" icon="el-icon-plus">新建</el-button></router-link>
    <router-link to="files"><el-button type="primary" icon="el-icon-search">从资料库里添加</el-button></router-link>
    <div class="content">
      <el-table
        ref="multipleTable"
        :data="publishedData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          fixed
          prop="ID"
          :label="$t('message.Manual')"
          width="100">
        </el-table-column>
        <el-table-column
          prop="brand"
          :label="$t('message.brand')"
          width="120">
        </el-table-column>
        <el-table-column
          prop="product"
          :label="$t('message.pub_product')"
          width="120">
        </el-table-column>
        <el-table-column
          prop="title"
          :label="$t('message.manual')"
          width="120">
        </el-table-column>
        <el-table-column
          prop="abstract"
          :label="$t('message.Abstract')"
          width="300">
        </el-table-column>
        <el-table-column
          prop="tag"
          :label="$t('message.tag')"
          width="120">
        </el-table-column>
        <el-table-column
          prop="timestamp"
          :label="$t('message.Creationtime')"
          width="150">
        </el-table-column>
         <el-table-column
          :label="$t('message.status')"
          width="180">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <div size="medium">{{scope.row.timestamp.replace(/T/," ").slice(0,19)}}{{ scope.row.status }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">{{scope.row.status == "上线" ? "下线" : "上线"}}</el-button>
            <el-button type="text" size="small" @click="share(scope.row)">分享</el-button>
            <el-button type="text" size="small" @click="editor(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../style/publishFiles.scss"
</style>
<style lang="scss">
.el-table 
  td{
    padding:5px 0;
    .cell{
    line-height:18px;
  }
}
</style>
<script>
import * as api from '../api/server.js';
import Cookies from 'js-cookie'
var QRCode = require('qrcode')
  export default{
    data(){
      return {
        publishedData:[],
        delArr:[],
        Visible:false,
        pubbookcode:'',
        pubbooklink:'',
        sharecode1:''
      }
    },
    mounted(){
      this.$emit("success","success");
      api.mypublish({username:Cookies.get('username')}).then(res => {
        console.log(res)
        if(res.data.result == "success"){
          this.publishedData = res.data.value;
        } else {
          this.$ssm(res.data)
        }
      })
    },
    methods:{
      handleClick(row) {
        let status = row.status == "上线" ? "下线" : "上线";
        api.changeStatus({ID:row.ID,status:status}).then(res => {
          if(res.data.result == "success"){
            let arr = [];
            console.log(res.data.result)
            arr = this.publishedData.filter(val => {
              if(val.ID == row.ID){
                val.status = status;
                val.timestamp = res.data.value.timestamp;
              }
              return val
            });
            this.publishedData = arr;
          } else {
            this.$ssm(res.data)
          }
        })
      },
      editor(row){
        this.$router.push({path:'publish',query:{ID:row.ID}});
      },
      online(){
        let arr = [];
        this.delArr.forEach(n => {
          let o = {
            ID:n.ID,
            username:Cookies.get('username'),
            status:"上线"
          }
          arr.push(o)
        })
        if(arr.length>0){
          api.changeonline(arr).then(res => {
            if(res.data.result == "success"){
              api.mypublish({username:Cookies.get('username')}).then(res => {
                console.log(res)
                if(res.data.result == "success"){
                  this.publishedData = res.data.value;
                } else {
                  this.$ssm(res.data)
                }
              })
            } else {
              this.$ssm(res.data)
            }
          })
        } else {
          this.$message({
            message: '请选择上线手册',
            type: 'warning'
          });
        }
      },
      offline(){
        let arr = [];
        this.delArr.forEach(n => {
          let o = {
            ID:n.ID,
            username:Cookies.get('username'),
            status:"下线"
          }
          arr.push(o)
        })
        if(arr.length>0){
          api.changeonline(arr).then(res => {
            if(res.data.result == "success"){
              api.mypublish({username:Cookies.get('username')}).then(res => {
                console.log(res)
                if(res.data.result == "success"){
                  this.publishedData = res.data.value;
                } else {
                  this.$ssm(res.data)
                }
              })
            } else {
              this.$ssm(res.data)
            }
          })
        } else {
          this.$message({
            message: '请选择下线手册',
            type: 'warning'
          });
        }
      },
      share(row){
        this.Visible = true;
        this.pubbookcode = row.ID;
        this.pubbooklink = row.link;
        this.sharecode1 = row.sharecode;
        setTimeout(function(){
          if(row.link){
          var canvas = document.getElementById("canvas");
          QRCode.toCanvas(canvas, row.link, function (error) {
          if (error) console.error(error)
            console.log('success!');
          })
        }
        },100)
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
        this.delArr = val;
      },
      deleteMore(){
        let arr = [];
        this.delArr.forEach(val => {
          let o = {
            ID:val.ID,
            username:Cookies.get('username')
          }
          arr.push(o)
        })
        if(arr.length==0){
          this.$message({
            message: '请选择需要删除手册',
            type: 'warning'
          });
        } else {
          api.delfile(arr).then(res => {
            if(res.data.result == "success"){
              let arr = [];
                for(let i=0;i<this.publishedData.length;i++){
                  let flag = true;
                  for(let j=0;j<this.delArr.length;j++){
                    if(this.publishedData[i].ID == this.delArr[j].ID){
                      flag = false
                    }
                  }
                  if(flag){
                    arr.push(this.publishedData[i])
                  }
                }
              this.publishedData = arr;      
            } else {
              this.$ssm(res.data)
            }
          })
        }
      },
      del(row){
        api.deletefile({ID:row.ID,username:Cookies.get('username')}).then(res => {
          if(res.data.result == "success"){
            let result = this.publishedData.filter(res => {
              return res.ID !== row.ID
            });
            this.publishedData = result
          } else {
            this.$ssm(res.data)
          }
        })
      }
    }
  }
</script>
