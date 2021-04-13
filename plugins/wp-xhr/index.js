/**
 * 针对wp接口的封装
 */
const Vue = require('vue');
const resouce = require('./genarateResource');

// 挂载到vue
Vue.prototype.$wpr = resouce;

module.exports = resouce;
