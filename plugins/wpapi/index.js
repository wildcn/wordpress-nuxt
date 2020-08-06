import Vue from 'vue';
import Wpapi from 'wpapi';
import { username, password, baseUrl } from '../../interface.config';
import proxy from './proxy';
import { TYPES } from './constants';

const wp = new Wpapi({ endpoint: baseUrl, username, password });

// 限制返回字段，便于缩小response提高接口速度
Object.values(TYPES).forEach(type => {
  wp[type] = proxy(wp[type], type);
})

// 挂载到vue
Vue.prototype.$wp = wp;

export default wp;
