import Vue from 'vue';
import axios from 'axios';

const githubToken =  'ba8a893f348cdf542d26360b46a4e74ab55bdef9';

Vue.prototype.$github = ({ url, params = {}, method = 'get' }) => {
  if (url.indexOf('github') !== -1) {
    return axios({ url, params, method, headers: { 'Authorization': 'Bearer ' + githubToken } })
  }
  return axios[method](url, params);
}
