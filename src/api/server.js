import post from './post.js';
import get from './get.js';
import put from './put.js';
import del from './delete.js';
var baseUrl = "https://nccloud.weihong.com.cn/ncmes/";
var baseUrl1 = "https://nccloud.weihong.com.cn/nccloudpdcapi/";
var baseUrl2 = "https://nccloud.weihong.com.cn/api/device/";
var baseUrl3 = 'https://nccloud.weihong.com.cn/nccloudOLhelp/search/';
var textUrl = "http://localhost:3000/";
//var textUrl = "http://192.168.12.192/onlinehelp/"
import Cookies from 'js-cookie'
const Interface = {
  //  1、注册的请求接口
  registerAjax: baseUrl + 'web/register',
  //  2、登录验证码请求接口
  vercodeAjax: baseUrl + "login/vercode/",
  //  3、登录接口请求
  loginAjax: baseUrl + 'web/login',
  //  4、忘记密码
  forgotPwd: baseUrl + "forgot/password",
  //  5、修改密码
  modifyPwd: baseUrl + "modify/password",
  //  6、个人信息
  userData: baseUrl + "user",
  //  7、修改个人信息
  modifyUserData: baseUrl + "user",
  //  8、获取全部设备
  allMachines: baseUrl + "focusmachine",
  //  9、删除设备
  removeMachines: baseUrl + "focusmachine",
  //  10、是否关注设备
  focusMachines: baseUrl + "focusmachine/enable",
  //  11、添加设备
  addMachines: baseUrl + "web/focusmachine",
  //  12、获取全部设备参数列表参数
  homeLists: baseUrl1 + "template/paramslist",
  //当在移动端的时候，点击左侧菜单，隐鲹整个菜单
  //  12、保存首页参数
  saveHomeParameters: baseUrl + "focusmachine/item",
  //  13、获取详情页设备参数列表
  getHomeParameters: baseUrl1 + "web/home/paramlist",
  //  14、删除详情页某个参数
  rmParameters: baseUrl1 + "web/home/paramone",
  //  15、注册验证码
  registerVercode: baseUrl + "vercode/",
  //  16、添加设备参数的列表
  getDetailMachineParemeter: baseUrl1 + "web/home/param",
  //  17、保存详细页的参数
  saveDetailMachineParemeter: baseUrl1 + "web/home/paramadd",
  //  18、保存智能报警、工作状态
  saveIntelligentAlarm: baseUrl1 + "web/config/setdata",
  //  19、获取设定的智能报警数值、工作状态
  getIntelligentAlarm: baseUrl1 + "web/config/getdata",
  //  20、保存新建模板名称
  saveTempName: baseUrl + "web/displayboard/newboard",
  //  21、获取已经保存到模板名称
  getTempName: baseUrl + "web/displayboard/getboardname",
  //  22、新建展板时，添加设备或者删除设备
  newTempAddMachineOrRmMachine: baseUrl + 'web/displayboard/addparams',
  //  23、获取新建展板的设备，并以磁贴展示出来
  getNewTempMachime: baseUrl + 'web/displayboard/getboardparams',
  //  24、删除展板 
  deleteTemp: baseUrl + 'web/displayboard/getboardname',
  //  25、获取历史消息
  getHistoryMsgs: baseUrl2 + "device/focusmachine/fivealarm",
  //  26、获取关注设备
  getFocusMachines: baseUrl + "focusmachinelist",
  //帮助文档==================================================================
  //获去产品目录
  getProductCatalog: baseUrl3 + "getAllCatalog",
  //添加产品目录
  addProductCatalog: baseUrl3 + "saveCatalog",
  //搜索产品目录
  searchProductCatalog: baseUrl3 + "searchBookName",
  //获取个人添加的书籍
  getPersonProduct: baseUrl3 + "myCatalog",
  //删除个人书籍
  rmPersonProduct:baseUrl3 + "deleteCatalog",
  //获取一级目录
  getFirstLevel: baseUrl3 + 'getCatalogIndex',
  //获取二级目录
  getSecondLevel: baseUrl3 + 'secondcons',
  //获取3级目录
  getThirdLevel: baseUrl3 + 'thirdcons',
  //搜索
  search: baseUrl3 + 'thirdcons',
  //搜帮助文档
  searchHelpPage: baseUrl3 + 'getTitleAndHtmlUrl?',
  //收藏文章借口
  clipArticle: baseUrl3 + 'storeup?',
  //点赞
  ThumbUp: baseUrl3 + 'laud?',
  //获取是否点赞和收藏
  ThumbUpAndCollectionStatus: baseUrl3,
  //=======================================================================
  //进来加载我的收藏
  myCollection: baseUrl3 + 'mystore?',
  //搜索我的收藏
  searchMystore: baseUrl3 + 'searchMystore?',
  //获取到关键词
  getKeyWord: baseUrl3 + "getkeyworlds",
  //效率分析
  efficiency: baseUrl2 + 'time_efficiency',
  //格式化数据
  fomatData: baseUrl1 + "web/home/allparam",
}

function getUser(){
  const user = {
    username:Cookies.get("username"),
    openid:Cookies.get("openid"),
    token:Cookies.get("token"),
    vercode:Cookies.get("vercode")
  }
  return user
}

export const fomatData = param => {
  let user = getUser();
  return get(`${Interface.fomatData}?token=${user.token}`)
}

export const userLogin = param => {
  return post(`${baseUrl}/web/login`,param)
}
 
export const vercode = param => {
  return get(`${baseUrl}/vercode/${param.phone}?=${param.num}`)
}
//消息报警
export const htrMsg = () => {
    let user = getUser();
    return get(`${baseUrl2}/device/focusmachine/fivealarm?username=${user.username}&token=${user.token}`)
}
//去获取关注设备，并以磁铁形式展示

export const getFocusMachine = () => {
    let user = getUser();
    return get(`${baseUrl}/focusmachinelist?username=${user.username}&openid=${user.openid}&token=${user.token}`)
}

export const machineParameterList = param => {
  let user = getUser();
  return get(`${Interface.getHomeParameters}/?username=${user.username}&uuid=${param.uuid}&token=${user.token}`)
}

export const allMachineDropList = () => {
  let user = getUser();
  return get(`${Interface.allMachines}?username=${user.username}&openid=${user.openid}&token=${user.token}`)
}

export const yesterdayEfficiency = param => {
  let user = getUser();
  let times = new Date(new Date().getTime() + 8 * 3600 * 1000 - 24 * 3600 * 1000).toISOString().substr(0, 10);
  return get(`${Interface.efficiency}?uuid=${param.uuid}&timestamp=${times}&token=${user.token}`)
}

export const addMachineParameters = param =>{
  let user = getUser();
  return get(`${Interface.getDetailMachineParemeter}?uuid=${param.uuid}&username=${user.username}&token=${user.token}`)
}

export const creatSaveMachineParameter = param =>{
  let user = getUser();
  let obj = {
    uuid:param.uuid,
    username:user.username,
    params:param.val
  }
  return put(`${Interface.saveDetailMachineParemeter}?token=${user.token}`,obj)
}

export const rmParameter = param => {
  let user = getUser();
  let obj = {
    uuid:param.uuid,
    username:user.username,
    param:param.val
  } 
  return del(`${Interface.rmParameters}?token=${user.token}`,obj)
}

export const getAllMachine = () => {
  let user = getUser();
  return get(`${ Interface.allMachines}?openid=${user.openid}&username=${user.username}&token=${user.token}`)  
}

export const addMachine =(param) => {
  let user = getUser();
  return get(`${Interface.homeLists}?username=${user.username}&openid=${user.openid}&uuid=${param}&token=${user.token}`)
}

export const saveHomeParameter = param => {
  let user = getUser();
  return put(`${Interface.saveHomeParameters}?username=${user.username}&openid=${user.openid}&uuid=${param.uuid}&item=${param.item}&token=${user.token}`)
}

export const removeMachine = param => {
  let user = getUser();
  return del(`${Interface.removeMachines}?openid=&username=${user.username}&uuid=${param.uuid}&token=${user.token}`)
}

export const addMachines = param => {
  let user = getUser();
  param.username = user.username;
  param.openid = user.openid;
  return post(`${Interface.addMachines}?token=${user.token}`,param)
}

export const userData = () => {
  let user = getUser();
  return get(`${Interface.userData}?username=${user.username}&openid=${user.openid}&token=${user.token}`)
}

export const modifyUserData = param => {
  let user = getUser();
  param.username = user.username;
  param.openid = user.openid
  return put(`${Interface.modifyUserData}?token=${user.token}`,param)
}

export const vercodeAjax = param => {
  return get(`${Interface.vercodeAjax}/${param.phone}?=${param.num}`)
}

export const modifyPwd = param =>{
  let user = getUser();
  return put(`${Interface.modifyPwd}?token=${user.token}`,param)
}

export const focusMachines = param => {
  let user = getUser();
  param.username = user.username;
  param.openid = user.openid;
  return put(`${Interface.focusMachines}?token=${user.token}`,param)
}


export const getHistoryMsg = () => {
  let user = getUser();
  return get(`${Interface.getHistoryMsgs}?username=${user.username}&token=${user.token}`)
}

export const getFocusMachines = () => {
  let user = getUser();
  return get(`${Interface.getFocusMachines}?username=${user.username}&openid=${user.openid}&token=${user.token}`)
}

export const getIntelligentAlarm = param => {
  let user = getUser();
  let obj = {
    uuid:param.uuid,
    username:user.username,
    type:param.type
  }
  return get(`${Interface.getIntelligentAlarm}?username=${user.username}&type=${param.type}&uuid=${param.uuid}&token=${user.token}`)
}

export const setIntelligentAlarm = param => {
  let user = getUser();
  let obj = {
    uuid:param.uuid,
    username:user.username,
    type:param.type,
    values : param.values
  }
  return post(`${Interface.saveIntelligentAlarm}?token=${user.token}`,obj)
}

export const getNewTempMachime = param => {
  let user = getUser();
  return get(`${Interface.getNewTempMachime}?username=${user.username}&token=${user.token}&displayname=${param.displayname}`)
}

export const newTempAddMachineOrRmMachine = param =>{
  let user = getUser();
  param.username = user.username;
  console.log(param)
  return post(`${Interface.newTempAddMachineOrRmMachine}?token=${user.token}`,param)
}

export const homeLists = param =>{
  let user = getUser();
  return get(`${Interface.homeLists}?username=${user.username}&openid=${user.openid}&uuid=${param.uuid}&token=${user.token}`)
}

export const delTempAddMachineOrRmMachine = param =>{
  let user = getUser();
  param.username = user.username;
  return del(`${Interface.newTempAddMachineOrRmMachine}?token=${user.token}`,param)
}

export const getTempName = () =>{
  let user = getUser();
  return get(`${Interface.getTempName}?username=${user.username}&token=${user.token}`)
}

export const saveTempName = param =>{
  let user = getUser();
  param.username = user.username;
  return post(`${Interface.saveTempName}?token=${user.token}`,param)
}

export const deleteTemp = param =>{
  let user = getUser();
  param.username = user.username;
  return del(`${Interface.deleteTemp}?token=${user.token}`,param)
}


export const forgetPwd = param =>{
  return put(Interface.forgotPwd, param)
}

export const getNumber = param => {
  return get(textUrl + "file/number")
}

export const editFile = param => {
  return post(textUrl + "file",param)
}

export const getAllFiles = param => {
  return get(`${textUrl}file/allfiles`)
}

export const getmycollect = param => {
  return get(`${textUrl}collection?username=${param.username}`)
}

export const deletefile = param => {
  return del(textUrl+"collection",param)
}

export const addmycollect = param => {
  return post(textUrl+"collection",param)
}

export const delfile = param => {
  return del(textUrl+"file",param)
}

export const changeStatus = param => {
  return put(textUrl+"file",param)
}

export const changeFile = param => {
  return post(textUrl+"file/find_file",param)
}

export const uploadfile = (param,config) => {
  return post(textUrl+"file/upload_file",param,config)
}