import { MediaModel } from '../media';
import wp from '../../plugins/wpapi';
import CategoryModel from './CategoryModel';

const categoryId = Symbol();
let categoryCollection = null;

export default class CategoryCollection {
  list = [];
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
  async fetchList () {
    const categories = await wp.categories().param('per_page', 100)
    const categoriesList = await Promise.complete(categories.map(async tag => await new CategoryModel(tag)));

    this.list = categoriesList
    return this.list
  }
  async fetchMap () {
    if (!this.list.length) {
      await this.fetchList();
    }
    this.mapList = this.list.reduce((pre, next) => Object.assign(pre, { [next.id]: next }), {})
    return this.mapList;
  }
  async fetchRootCategories () {
    const rootCategories = await wp.categories().order('asc').orderby('id').param('per_page', 100).param('parent', 0);
    return rootCategories;
  }
  async fetchCategoriesByRootId (id) {
    const root = await wp.categories().id(id);
    const children = await wp.categories().param('parent', id);
    const response = await Promise.complete([].concat(root, children).map(async item => await new CategoryModel(item)));
    return response;
  }
}

