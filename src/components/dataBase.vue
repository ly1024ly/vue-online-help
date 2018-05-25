<template>
  <div class="data">
    <el-dialog
      :title="DialogTitle"
      :visible.sync="centerDialogVisible"
      :width="popwidth"
      center>
      <div v-show="html==''?true:false">
        <p>您可以用以下信息的任意一种向他人分享资料：</p><div>手册号：{{bookcode}}</div><div>分享码：{{sharecode}}</div><div>分享链接：{{booklink}}</div><div>分享链接二维码：</div><p class="qrcode" style="text-align:center"><canvas id="canvas" ref="canvas"></canvas></p>
      </div>
      <div class="" v-html="html">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <router-link to="file"><el-button type="primary" icon="el-icon-arrow-left">返回</el-button></router-link>
    <el-input placeholder="请输入内容" v-model="input5" class="input-with-select">
      <el-select v-model="select" slot="prepend" placeholder="排序">
        <el-option label="智能" value="1"></el-option>
        <el-option label="品牌" value="2"></el-option>
        <el-option label="产品" value="3"></el-option>
        <el-option label="手册" value="4"></el-option>
        <el-option label="手册号" value="5"></el-option>
        <el-option label="上线时间" value="6"></el-option>

      </el-select>
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <div class="content">
      <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        fixed
        prop="ID"
        label="手册号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="brand"
        label="品牌"
        width="120">
      </el-table-column>
      <el-table-column
        prop="product"
        label="产品"
        width="120">
      </el-table-column>
      <el-table-column
        prop="title"
        label="手册名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="abstract"
        label="摘要"
        width="350">
      </el-table-column>
      <el-table-column
        prop="timestamp"
        label="上线时间"
        width="200">
      </el-table-column>
      <el-table-column
        prop="tag"
        label="标签"
        width="120">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">预览</el-button>
          <el-button type="text" size="small" @click="share(scope.row)">分享</el-button>
          <a :title="scope.row.secrecy_type"><el-button type="text" size="small" @click="add(scope.row)">添加</el-button></a>
        </template>
      </el-table-column>
    </el-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>

@import '../style/database.scss'
</style>

<style lang="scss">
.el-select .el-input {
    width: 130px;
  }
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.el-input-group{
  width:40%;
}
</style>

<script type="text/javascript">
import * as api from '../api/server.js';
import Cookies from 'js-cookie'
var QRCode = require('qrcode')
  export default{
    data(){
      return {
        input5: '',
        select:'',
        popwidth:"60%",
        html:"this is a jock",
        centerDialogVisible: false,
        DialogTitle:'',
        tableData: [],
        bookcode:'',
        booklink:'',
        sharecode:''
      }
    },
    mounted(){
      this.$emit("success","success");
      api.getAllFiles({username:Cookies.get("username")}).then(res => {
        if(res.data.result == "success"){
          let arr = [];
          arr = res.data.value.filter(val => {
            console.log(val.status)
            return val.status == "上线"
          })
          this.tableData = arr;
          console.log(arr)
        } else {
          this.$ssm(res.data)
        }
      })
    },
    methods:{
      handleClick(row) {
        this.centerDialogVisible = true;
        this.popwidth = "60%";
        this.DialogTitle = "预览";
        this.html = 'huahua';
      },
      add(row){
        this.addapi(row)
      },
      addapi(row){
        api.addmycollect(row).then(res => {
          if(res.data.result == "success"){
            this.$message({
              message: '添加成功',
              type: 'success'
            });
          } else {
            this.$ssm(res.data)
          }
        })
      },
      share(row){
        this.centerDialogVisible = true;
        this.html = "";
        this.popwidth = "30%";
        this.bookcode = row.ID;
        this.booklink = row.link;
        this.sharecode = row.sharecode;
        setTimeout(function(){
          if(row.link){
          var canvas = document.getElementById("canvas");
          QRCode.toCanvas(canvas, row.link, function (error) {
          if (error) console.error(error)
            console.log('success!');
          })
        }
        },100)
        
        this.DialogTitle = "分享";
      }
    }
  }
</script>