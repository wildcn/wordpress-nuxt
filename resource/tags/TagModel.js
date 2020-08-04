import { isInteger, isPlainObject, isArray, isEmpty } from 'lodash';
import wp from '../../plugins/wpapi';

export default class TagModel {
  id = null;
  name = null;
  slug = null;

  constructor(args) {
    if (isInteger(args)) {
      this.id = args;
      this.fetchMeta();
    } else if (isPlainObject(args) && this.isValidTag(args)) {
      Object.assign(this, args);
    } else {
      throw new Error('TagModel args is invalid');
    }
  }
  async fetchMeta () {
    try {
      const response = await wp.tags().id(this.id);
      if (this.isValidTag(response)) {
        Object.assign(this, response);
      }
    } catch (err) {
      console.error(err)
    }
  }
  
  isValidTag (data) {
    return data.id && data.name;
  }
}

