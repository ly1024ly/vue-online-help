import fetch from 'isomorphic-fetch'
import axios from 'axios'


export default function post(url,param,config){
  return axios.post(url,param,config={})
}