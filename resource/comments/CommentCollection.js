import { isInteger, isPlainObject, isArray, isEmpty } from 'lodash';
import wp from '../../plugins/wpapi';
import CommentModel from './CommentModel';
import { uniqBy } from 'lodash';
const categoryId = Symbol();
let categoryCollection = null;

export default class CommentCollection {
  list = [];
  param = {
    per_page: 20,
    page: 1
  }
  constructor(id) {
    if (id !== categoryId) {
      throw new Error(`Can not create a CommentCollection instance.`);
    }
  }
  static getInstance () {
    if (categoryCollection === null) {
      categoryCollection = new CommentCollection(categoryId);
    }

    return categoryCollection;
  }
  async more (options) {
    if (this.list.length === (this._paging && this._paging.total)) {
      throw new Error('no data')
    }
    this.list.length !== 0 && ++this.param.page;
    const moreList = this.fetchList(options);
    return moreList;
  }
  async fetchList (options = {}) {
    const param = Object.assign(this.param, options);
    const response = await wp.comments().param(param)
    this._paging = response._paging;
    const list = await Promise.complete(response.map(async id => await new CommentModel(id)));
    this.list = [].concat(this.list, list);
    this.list = uniqBy(this.list, 'id');
    this.fetchMap();
    return list
  }
  fetchMap () {
    this.mapList = this.list.reduce((pre, next) => Object.assign(pre, { [next.id]: next }), {})
    this.postMapList = this.list.reduce((pre, next) => {
      pre[next.post] = pre[next.post] || [];
      pre[next.post].push(next);
      return pre;
    }, {})
    return this.mapList;
  }
}

