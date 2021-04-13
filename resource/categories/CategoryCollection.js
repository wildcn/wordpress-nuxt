import { MediaModel } from '../media';
import wpr from '../../plugins/wp-xhr';
import CategoryModel from './CategoryModel';
import { uniqBy } from 'lodash';

const categoryId = Symbol();
let categoryCollection = null;

export default class CategoryCollection {
  list = [];
  param = {
    limit: 100,
    offset: 0
  }
  constructor(id) {
    if (id !== categoryId) {
      throw new Error(`Can not create a CategoryCollection instance.`);
    }
  }
  static getInstance () {
    if (categoryCollection === null) {
      categoryCollection = new CategoryCollection(categoryId);
    }

    return categoryCollection;
  }
  
  async more (options) {
    if (this.list.length >= (this._paging && this._paging.count)) {
      throw new Error('no data')
    }
    if (this.list.length) {
      this.param.offset = (1+this.param.offset)*this.param.limit;
    }
    const moreList = await this.fetchList(options);
    return moreList;
  }
  async fetchList (options = {}) {
    const param = Object.assign(this.param, options);
    const response = await wpr.categories.read(param);
    this._paging = response._paging;
    const list = await Promise.complete(response.rows.map(async tag => await new CategoryModel(tag)), 'category');
    this.list = [].concat(this.list, list);
    this.list = uniqBy(this.list, 'id');
    this.fetchMap();
    return list
  }
  fetchMap (options) {
    this.mapList = this.list.reduce((pre, next) => Object.assign(pre, { [next.id]: next }), {})
    return this.mapList;
  }
  // async fetchRootCategories () {
  //   const rootCategories = await wp.categories().order('asc').orderby('id').param('limit', 100).param('parent', 0);
  //   return rootCategories;
  // }
  async fetchCategoriesByRootIds (id) {
    const ids = [].concat(id);
    if (!this.list.length) {
      await this.more();
    }
    const response = this.list.filter((item => {
      return (ids.indexOf(item.id) !== -1 || ids.indexOf(item.parent) !== -1)
    }))
    return response;
  }
  filterCategoriesByName (condations = []) {
    const list = this.list;

  }
}

