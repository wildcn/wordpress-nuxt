import { isInteger, isPlainObject, isArray, isEmpty } from 'lodash';
import { MediaModel } from '../media';
import wp from '../../plugins/wpapi';

export default class CategoryModel {
  id = null;
  count = 0;
  name = null;

  constructor(args) {
    return new Promise((resolve, reject) => {
      if (isInteger(args)) {
        this.id = args;
        this.fetchMeta().then(() => {
          resolve(this);
        })
      } else if (isPlainObject(args) && this.isValidCategory(args)) {
        Object.assign(this, args);
        resolve(this);
      } else {
        reject('CategoryModel args is invalid')
        // throw new Error('CategoryModel args is invalid');
      }
    })
  }
  async fetchMeta () {
    const category = await wp.categories().id(this.id);
    Object.assign(this, category);
    return this;
  }
  isValidCategory (data) {
    return data.id && data.name;
  }
}

