import { MediaModel } from '../media';
import wp from '../../plugins/wpapi';
import CategoryModel from './CategoryModel';
import { NovelCategoryModel } from './';

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
    const categories = await wp.categories();
    const novelCategories = await wp.novelCategories();

    const categoriesList = await Promise.complete(categories.map(async tag => await new CategoryModel(tag)));
    const novelCategoriesList = await Promise.complete(novelCategories.map(async tag => await new NovelCategoryModel(tag)));

    this.list = [].concat(categoriesList, novelCategoriesList)
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
    if (!this.list.length) {
      await this.fetchList();
    }
    const root = this.list.filter(model => {
      return model.parent === 0
    })
    return root;
  }
}

