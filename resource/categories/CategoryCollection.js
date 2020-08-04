import { isInteger, isPlainObject, isArray, isEmpty } from 'lodash';
import { MediaModel } from '../media';
import wp from '../../plugins/wpapi';
import CategoryModel from './CategoryModel';

const categoryId = Symbol();
let categoryCollection = null;

export default class CategoryCollection {

  constructor(id) {
    if (id !== categoryId) {
      throw new Error(`Can not create a WbItemCollection instance.`);
    }
  }
  static getInstance () {
    if (categoryCollection === null) {
      categoryCollection = new CategoryCollection(categoryId);
    }

    return categoryCollection;
  }
  async fetchCategories () {
    const categories = await wp.categories();
    const novelCategories = await wp.novelCategories();
    this.categoriesModel = await Promise.all([].concat(categories,novelCategories).map(async item => new CategoryModel(item)));
  }
  fetchRootCategories () {
    if (!this.categoriesModel.length) {
      return [];
    }
    const root = this.categoriesModel.filter(model => {
      return model.parent === 0
    })
    return root;
  }
}

