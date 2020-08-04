import { isInteger, isPlainObject, isArray, isEmpty } from 'lodash';
import { MediaModel } from '../media';
import wp from '../../plugins/wpapi';

export default class CategoryModel {
  id = null;
  count = 0;
  name = null;
  slug = null;

  constructor(args) {
    if (isInteger(args)) {
      this.id = args;
      this.fetchMeta();
    } else if (isPlainObject(args) && this.isValidCategory(args)) {
      Object.assign(this, args);
      this.fetchMedias();
    } else {
      throw new Error('CategoryModel args is invalid');
    }
  }
  fetchMeta () {
    wp.categories().id(this.id).then(response => {
      if (this.isValidCategory(response)) {
        Object.assign(this, response);
        this.fetchMedias();
      }
    })
  }
  fetchMedias () {
    if (isArray(this.media) && this.media.length) {
      this.mediaCollection = this.media.map(id => new MediaModel(id));
    }
  }
  isValidCategory (data) {
    return data.id && data.name;
  }
}

