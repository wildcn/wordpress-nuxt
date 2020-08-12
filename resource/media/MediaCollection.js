import wp from '../../plugins/wpapi';
import MediaModel from './MediaModel';
import { uniqBy } from 'lodash';
const tagId = Symbol();
let mediaCollection = null;

export default class MediaCollection {
  list = [];
  mapList = {}
  param = {
    per_page: 20,
    page: 1
  }
  constructor(id) {
    if (id !== tagId) {
      throw new Error(`Can not create a MediaCollection instance.`);
    }
  }
  static getInstance () {
    if (mediaCollection === null) {
      mediaCollection = new MediaCollection(tagId);
    }

    return mediaCollection;
  }
  async more (options) {
    if (this.list.length === (this._paging && this._paging.total)) {
      throw new Error('no data')
    }
    this.list.length !== 0 && ++this.param.page;
    const moreList = await this.fetchList(options);
    return moreList;
  }
  async fetchList (options) {
    const param = Object.assign(this.param, options);
    const response = await wp.media().param(param)
    this._paging = response._paging;
    const list = await Promise.complete(response.map(async tag => await new MediaModel(tag)),'mediaCollection/fetchList');
    this.list = [].concat(this.list, list);
    this.list = uniqBy(this.list,'id');
    this.fetchMap();
    return list
  }
  fetchMap (options) {
    this.mapList = this.list.reduce((pre, next) => Object.assign(pre, { [next.id]: next }), {})
    return this.mapList;
  }
}

