import fetch from 'isomorphic-fetch'
import axios from 'axios'


export default function post(url,param,config){
  console.log(url)
  return axios.post(url,param,config={})
}