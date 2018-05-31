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
            <p><el-radio :label="public">{{this.$t('message.public')}}</el-radio></p>
            <p><el-radio :label="secret1">{{this.$t('message.secrete1')}}</el-radio></p>
            <p><el-radio :label="secret2">{{this.$t('message.secrete2')}}</el-radio>
            </p>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="this.$t('message.Equipmentnumber')" v-show="Equipmentnumber" prop="typenum">
          <span style="color:red">{{$t('message.hint')}}</span>
          <div class="cInfo">
            <div class="add">
              <span v-for="(item,index) in addSpan">{{item}}<i @click="delSpan(item)" class="el-icon-close" /></span>
            </div>
            <input :placeholder="this.$t('message.Equipmentnumber')" class="el-number" size="small" v-model="ruleForm.typenum" @keyup.space="addNumber()"/>
            
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
        <el-form-item :label="this.$t('message.Abstract')" prop="Abstract">
          <el-input v-model="ruleForm.Abstract" size="medium"></el-input>
        </el-form-item>
        <el-form-item :label="this.$t('message.publishtype')" prop="publishtype" v-model="ruleForm.publishtype" >
          <div @change="radio">
            <el-radio v-model="radio7" label="download" border>上传文件</el-radio>
            <el-radio v-model="radio7" label="url" border>原文链接</el-radio>
            <el-radio v-model="radio7" label="editor" border>编辑</el-radio>
          </div>
        </el-form-item>
        <el-form-item :label="this.$t('message.download')" prop="download" v-show="type=='download' ? true : false">
          <el-input v-model="ruleForm.download" class="download" ></el-input>
          <div class="uploadbtn">
            <input type="file" @change="displayImage" ref="fileInput" value="上传" class='btn' style="display:block"/><i class="el-icon-upload el-icon--right"></i>
          </div>
          <el-upload
            action="http://localhost:3000/file/upload_file"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item :label="this.$t('message.url')" prop="url" v-show="type=='url' ? true : false">
          <el-input v-model="ruleForm.url" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="详细" v-show="type=='editor' ? true : false">
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
.el-radio.is-bordered{
  height:auto;
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
        border:block;
        background:transparent;
        position:absolute;
        left:10px;
        display:none;
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
import axios from 'axios';

  
  export default{
    data(){
      return{
        fileList: [],
        public:'public',
        secret1:'secret_sharecode',
        secret2:'secret_machine',
        timestamp:'',
        radio7:'',

        publishtype:'',
        type:'',
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
          publishtype:'',
          type: "public",
          Abstract:'',
          tag:'',
          download:'',
          url:'',
          title:'',
          brand:'',
          product:'',
          file:'',
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
          publishtype:[
            { required: true, message: '请选择发布方式', trigger: 'blur'}
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
              manufacturer:res.data.value.manufacturer,
              publishtype:res.data.value.publishtype          
            }

            this.type = res.data.value.publishtype;
            this.radio7 = res.data.value.publishtype;
            this.Equipmentnumber = res.data.value.secrecy_model.length>0 ? true : false;
            this.addSpan = res.data.value.secrecy_model;
            this.content = res.data.value.html;
            this.editorHtml = res.data.value.html;
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
      radio(val){
        this.type = this.radio7;
        this.ruleForm.publishtype = this.radio7;
        console.log(this.radio7)
      },
      displayImage(){
        const file = this.$refs.fileInput.files[0];
        file.onlyname = this.code+file.name;
        let param = new FormData();
        param.append('_id',Cookies.get('_id'));
        param.append('file',file);
        param.append('ID',this.code);
        this.ruleForm.file = param;
        let config = {
          headers:{'Content-Type':'application/x-www-form-urlencoded'}
        };
         
  
       
      },
      typeChange(val){

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
        if(res == this.secret2){
          this.Equipmentnumber = true;
          
        } else {
          this.Equipmentnumber = false;
        }
      },
      aha(){
        let that = this;
        if(that.radio7 == "download"){
          that.ruleForm.url = "";
          that.editorHtml = "";
          return true
        } else if(that.radio7 == "editor"){
          that.ruleForm.url = "";
          that.ruleForm.file = "";
          return true
        } else if(that.radio7 == "url"){
          that.ruleForm.file = "";
          that.editorHtml = "";
          return true
        }
      },
      submitForm(formName) {
        let that = this;
        let flag = false;
        //判断哪种方式上传文件的
        this.aha();
        let username = Cookies.get('username');
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let obj = {
              ID:this.code.toString(),
              id:Cookies.get('_id'),
              username:username,
              title:this.ruleForm.title,
              secrecy_type:this.ruleForm.type,
              secrecy_model:this.addSpan,
              manufacturer:this.ruleForm.manufacturer,
              brand:this.ruleForm.brand,
              product:this.ruleForm.product,
              tag:this.ruleForm.tag,
              publishtype:this.ruleForm.publishtype,
              abstract:this.ruleForm.Abstract,
              link:this.ruleForm.url,
              upload_file:'',
              filepath:'',
              status:"",
              file:this.ruleForm.file,
              html:this.editorHtml,
              timestamp:this.timestamp.replace(/T/," ").slice(0,19),
              sharecode:md5(this.code)
            }
            if(this.$route.query.ID){
            //编辑
              obj.status = "下线";
              let o = {
                ID:this.code,
                obj:obj
              }
              console.log(o)
              api.editorFile(o).then(res => {
                if(res.data.result == "success"){
                  console.log(this.ruleForm.file)
                  if(this.ruleForm.file!==""){
                    api.uploadfile(this.ruleForm.file)
                      .then(response=>{
                        if(response.data.result == "success"){
                          this.$message({
                            message: '发布成功',
                            type: 'success'
                          });
                          setTimeout(function(){
                            that.$router.push({path:'/published'})
                          },1500)
                        } else {
                          this.$ssm(response.data)
                        }
                    })  
                  } else{
                    this.$message({
                      message: '发布成功',
                      type: 'success'
                    });
                    setTimeout(function(){
                      that.$router.push({path:'/published'})
                    },1500)
                  }
                } else {
                  this.$ssm(res.data)
                }
              })
            } else {
            //首次发布
              obj.status = "上线";
              console.log(obj)
              api.editFile(obj).then(res => {
                if(res.data.result == "success"){
                  console.log("fabui")
                  if(this.ruleForm.file!==""){
                    api.uploadfile(this.ruleForm.file)
                      .then(response=>{
                        if(response.data.result == "success"){
                          this.$message({
                            message: '发布成功',
                            type: 'success'
                          });
                          setTimeout(function(){
                            that.$router.push({path:'/published'})
                          },1500)
                        } else {
                          this.$ssm(response.data)
                        }
                    })  
                  } else{
                    this.$message({
                      message: '发布成功',
                      type: 'success'
                    });
                    setTimeout(function(){
                      that.$router.push({path:'/published'})
                    },1500)
                  }
                } else {
                  this.$ssm(res.data)
                }
              })
            }
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
        this.ruleForm.product = "";
        this.addSpan = [];

      }
    }
  }
</script>