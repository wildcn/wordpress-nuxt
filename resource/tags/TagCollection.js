import wpr from '../../plugins/wp-xhr';
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
    limit: 100,
    offset: 0
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
    if (this.list.length === (this._paging && this._paging.count)) {
      throw new Error('no data')
    }
    if (this.list.length) {
      this.param.offset = (1 + this.param.offset) * this.param.limit;
    }
    const moreList = await this.fetchList(options);
    return moreList;
  }
  async fetchList (options = {}) {
    const param = Object.assign(this.param, options);
    const response = await wpr.tags.read(param)

    this._paging = response._paging;
    const list = response.rows;
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

