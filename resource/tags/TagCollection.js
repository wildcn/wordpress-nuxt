import wp from '../../plugins/wpapi';
import TagModel from './TagModel';
import { uniqBy } from 'lodash';
const tagId = Symbol();
let categoryCollection = null;

export default class TagCollection {
  map = {};
  list = [];
  requestStatus = false;
  mapList = {}
  param = {
    per_page: 100,
    page: 1
  }
  constructor(id) {
    if (id !== tagId) {
      throw new Error(`Can not create a WbItemCollection instance.`);
    }
  }
  static getInstance () {
    if (categoryCollection === null) {
      categoryCollection = new TagCollection(tagId);
    }

    return categoryCollection;
  }
  async more (options) {
    if (this.list.length === (this._paging && this._paging.total)) {
      throw new Error('no data')
    }
    this.list.length !== 0 && ++this.param.page;
    const moreList = await this.fetchList(options);
    return moreList;
  }
  async fetchList (options = {}) {
    const param = Object.assign(this.param, options);
    const response = await wp.tags().param(param);
    this._paging = response._paging;
    const list = await Promise.complete(response.map(async tag => await new TagModel(tag)),'tagCollection/fetchList');
    this.list = [].concat(this.list, list);
    this.list = uniqBy(this.list, 'id');
    this.fetchMap();
    return list
  }
  fetchMap (options) {
    this.mapList = this.list.reduce((pre, next) => Object.assign(pre, { [next.id]: next }), {})
    return this.mapList;
  }
}

