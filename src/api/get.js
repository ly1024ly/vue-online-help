import fetch from 'isomorphic-fetch'
import axios from 'axios'


export default function get(url){
  return axios.get(url)

}