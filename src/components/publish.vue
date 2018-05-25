<template>
  <div class="publish">
    <el-dialog
      :title="pu_DialogTitle"
      :visible.sync="pu_centerDialogVisible"
      :width="pu_popwidth"
      center>
      <div class="" v-html="editorHtml">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-button type="primary" icon="el-icon-refresh" @click="resetForm('ruleForm')">{{$t('message.reset')}}</el-button>
    <el-button type="primary" icon="el-icon-view" @click="showEditor">{{$t('message.preview')}}</el-button>
    <el-button type="primary" icon="el-icon-delete" @click="giveup">{{$t('message.giveup')}}</el-button>
    <el-button type="primary" icon="el-icon-circle-check" @click="submitForm('ruleForm')">{{$t('message.save')}}</el-button>
    <div class="content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item :label="this.$t('message.number')" prop="code" class="number"> 
          <el-input v-model="code" disabled  size="small"></el-input>
        </el-form-item>
        <el-form-item :label="this.$t('message.publish_title')" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item :label="this.$t('message.Confidentiality_properties')" prop="type">
          <el-radio-group v-model="ruleForm.type" @change="radioChange">
          <p><el-radio :label="this.$t('message.public')">{{this.$t('message.public')}}</el-radio></p>
          <p><el-radio :label="this.$t('message.secrete1')">{{this.$t('message.secrete1')}}</el-radio></p>
          <p><el-radio :label="this.$t('message.secrete2')">{{this.$t('message.secrete2')}}</el-radio>
          </p>
        </el-radio-group>
        </el-form-item>
        <el-form-item :label="this.$t('message.Equipmentnumber')" v-show="Equipmentnumber" prop="typenum">
          <span style="color:red">{{$t('message.hint')}}</span>
          <div class="cInfo">
            <div class="add">
              <span v-for="(item,index) in addSpan">{{item}}<i @click="delSpan(item)" class="el-icon-close" /></span>
            </div>
            <input  :placeholder="this.$t('message.Equipmentnumber')" class="el-number" size="small" v-model="ruleForm.typenum" @keyup.space="addNumber()"/>
            
          </div>
        </el-form-item>
        <el-form-item prop="manufacturer">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item :label="this.$t('message.manufacturer')" prop="manufacturer">
              <el-input  :placeholder="this.$t('message.manufacturer')" v-model="ruleForm.manufacturer"></el-input>
            </el-form-item>
            <el-form-item :label="this.$t('message.brand')">
              <el-input  :placeholder="this.$t('message.brand')" v-model="ruleForm.brand"></el-input>
            </el-form-item>
            <el-form-item :label="this.$t('message.pub_product')">
              <el-input  :placeholder="this.$t('message.pub_product')" v-model="ruleForm.product"></el-input>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item :label="this.$t('message.tag')" prop="tag">
          <el-input v-model="ruleForm.tag"></el-input>
        </el-form-item>
        <el-form-item :label="this.$t('message.download')" prop="download">
          <el-input v-model="ruleForm.download" class="download" ></el-input>
          <div class="uploadbtn">
            <el-upload
              class="upload-demo"
              action="http://localhost:3000/file/upload_file"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item :label="this.$t('message.url')" prop="url">
          <el-input v-model="ruleForm.url" size="medium"></el-input>
        </el-form-item>
        <el-form-item :label="this.$t('message.Abstract')" prop="Abstract">
          <el-input v-model="ruleForm.Abstract" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="详细">
          <div class="edit_container">
            <quill-editor ref="myTextEditor"
              :content="content"
              :options="editorOption"
              @change="onEditorChange($event)">
            </quill-editor>
          </div>
         </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<style lang="scss" scoped>

@import '../style/publish.scss'
</style>
<style lang="scss">
.number .el-input__inner{
  width:15%;
}
.el-radio__input{
  line-height:3;

}

.quill-editor {
  height: 745px;

  .ql-container {
    height: 680px;
  }
}

.limit {
  height: 30px;
  border: 1px solid #ccc;
  line-height: 30px;
  text-align: right;

  span {
    color: #ee2a7b;
  }
}
.download{
  width:50%;
}
.ql-snow .ql-editor img {
  max-width: 480px;
}

.ql-editor .ql-video {
  max-width: 480px;
}
.uploadbtn{
      width:100px;
      border:1px solid #eee;
      position:relative;
      display:inline-block;
      .btn{
        border:none;
        background:transparent;
        position:absolute;
        left:10px;
      }
    }
.cInfo{
  .add{
    display:inline-block;
    span{
      padding:3px 5px;
      &:hover{
        background:#eee;
      }
    }
  }
  .el-number{
    width:200px;
    height:30px;
    border:none;
    outline:none;
  }
}
</style>

<script>
import { quillEditor } from 'vue-quill-editor'
import VueQuillEditor from 'vue-quill-editor'
import * as api from '../api/server.js';
import Cookies from 'js-cookie';
import md5 from 'md5';
import axios from 'axios'

  
  export default{
    data(){
      return{
        fileList: [],
        timestamp:'',
        previewImageSrc:'',
        content: '<h2>I am Example</h2>',
         editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': [] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['clean'],
              ['link', 'image', 'video']
            ],
            syntax: {
              highlight: text => hljs.highlightAuto(text).value
            },
            history: {
              delay: 1000,
              maxStack: 50,
              userOnly: false
            }
          }
        },
        content:"",  
        radio2: 3,
        Equipmentnumber:false,
        pu_DialogTitle:'',
        editorHtml:'',
        pu_centerDialogVisible:false,
        pu_popwidth:'60%',
        code:'',
        addSpan:[],
        url:this.$t('message.url'),
        ruleForm: {
          name: '',
          type: this.$t('message.public'),
          Abstract:'',
          tag:'',
          download:'',
          url:'',
          title:'',
          brand:'',
          product:'',
          manufacturer:'',
          typenum:""
        },
        infoForm: {
         a_title: '',
         a_source: '',
         a_content:'',
         editorOption: {}
        },
        rules: {
          name:[
            { message: '请填写标签', trigger: 'change' }
          ],
          Abstract:[{
            max:30, message: '摘要不可超过30个文字', trigger: 'blur'
          }],
          title:[{
            required: true, message: '请填写标题', trigger: 'blur'
          }],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          manufacturer:[{
            required: true, message: '请填写厂商', trigger: 'change' 
          }],
          download:[{

          }],
      
          
        }
      
      }
    },
    mounted(){
      this.$emit("success","success");
      console.log(this.$route.query)
      if(this.$route.query.ID){
        this.code = this.$route.query.ID;
        api.changeFile({ID:this.$route.query.ID}).then(res => {
          if(res.data.result == "success"){
            this.ruleForm = {
              type: res.data.value.secrecy_type,
              Abstract:res.data.value.abstract,
              tag:res.data.value.tag,
              download:'',
              url:res.data.value.link,
              title:res.data.value.title,
              brand:res.data.value.brand,
              product:res.data.value.product,
              manufacturer:res.data.value.manufacturer          
            }
            this.Equipmentnumber = res.data.value.secrecy_model.length>0 ? true : false;
            this.addSpan = res.data.value.secrecy_model;
          } else {
            this.$ssm(res.data)
          }
        })
      } else {
        api.getNumber().then(res => {
          if(res.data.result == "success"){
            this.code = res.data.value.ID;
            this.timestamp = res.data.value.timestamp.replace(/T/," ").slice(0,19);
          }
        })
      }
      this.fileupload = {ID:this.code}
    },
    computed:{
      editor() {
        return this.$refs.myTextEditor.quillEditor
      }
    },
    components: {
      quillEditor
    },
    watch:{

    },
    methods:{
      onEditorChange({ editor, html, text }){
        this.editorHtml = html;
        console.log(editor, html, text)
      },
      giveup(){
        this.$router.push({path:'published'})
      },
      showEditor(){
        this.pu_centerDialogVisible = true;

      },
      displayImage(){
        const file = this.$refs.fileInput.files[0]
        let param = new FormData();
        param.append('file',file,file.name);
        param.append('ID',this.code);
        let config = {
          headers:{'Content-Type':'multipart/form-data'}
        };
         api.uploadfile(param,config)
        .then(response=>{
          console.log(response.data);
        })    
      },
      delSpan(res){
        let result = this.addSpan.filter(val => {
          return val!==res
        });
        console.log(result)
        this.addSpan = result;
      },
      addNumber(){
        console.log(this.ruleForm.typenum.length>0)
        if(this.ruleForm.typenum.indexOf(" ")>=0&&this.ruleForm.typenum.trim()!== ""){
          this.addSpan.push(this.ruleForm.typenum)
          console.log(this.ruleForm.typenum)
          this.ruleForm.typenum = "";
          console.log(this.ruleForm.typenum)
        }
      },
      radioChange(res){
        if(res == this.$t('message.secrete2')){
          this.Equipmentnumber = true;
          
        } else {
          this.Equipmentnumber = false;
        }
      },
      submitForm(formName) {
        console.log(this.ruleForm)
        let that = this;
        let username = Cookies.get('username');
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let obj = {
              ID:this.code,
              id:Cookies.get('_id'),
              username:username,
              title:this.ruleForm.title,
              secrecy_type:this.ruleForm.type,
              secrecy_model:this.addSpan,
              manufacturer:this.ruleForm.manufacturer,
              brand:this.ruleForm.brand,
              product:this.ruleForm.product,
              tag:this.ruleForm.tag,
              abstract:this.ruleForm.Abstract,
              link:this.ruleForm.url,
              upload_file:'',
              filepath:'',
              status:"上线",
              timestamp:this.timestamp,
              sharecode:md5(this.code)
            }
            api.editFile(obj).then(res => {
              if(res.data.result == "success"){
                this.$message({
                  message: '发布成功',
                  type: 'success'
                });
                setTimeout(function(){
                  that.$router.push({path:'/published'})
                },1000)
              } else {
                this.$ssm(res.data)
              }
            })
          } else {
            
            return false;
          }
        });
      },
      handleChange(file, fileList) {
        this.fileList3 = fileList.slice(-3);
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>