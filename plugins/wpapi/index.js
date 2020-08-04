import Vue from 'vue';
import Wpapi from 'wpapi';
import { username, password, baseUrl } from '../../interface.config';
import proxy from './proxy';
import { TYPES } from './constants';

const wp = new Wpapi({ endpoint: baseUrl, username, password });
// 注册自定义novel类型
var namespace = 'wp/v2'; // use the WP API namespace
var novelPost = '/novel/(?P<id>)'; // novelPost string - allows optional ID parameter
var novelCategories = '/novel_category/(?P<id>)';
var novelTags = '/novel_tag/(?P<id>)';

wp.novel = wp.registerRoute(namespace, novelPost);
wp.novelCategories = wp.registerRoute(namespace, novelCategories);
wp.novelTags = wp.registerRoute(namespace, novelTags);



// 限制返回字段，便于缩小response提高接口速度
Object.values(TYPES).forEach(type => {
  wp[type] = proxy(wp[type], type);
})
// 限制自定义router
wp.novel = proxy(wp.novel, TYPES.POSTS);
wp.novelCategories = proxy(wp.novelCategories,TYPES.CATEGORIES);
wp.novelTags = proxy(wp.novelTags,TYPES.TAGS)

// 挂载到vue
Vue.prototype.$wp = wp;

export default wp;
