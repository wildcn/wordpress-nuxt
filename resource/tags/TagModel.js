import { isInteger, isPlainObject, isArray, isEmpty } from 'lodash';
import wp from '../../plugins/wpapi';

export default class TagModel {
  id = null;
  name = null;

  constructor(args) {
    console.log("TagModel -> constructor -> args", args)
    return new Promise((resolve, reject) => {
      if (isInteger(args)) {
        this.id = args;
        this.fetchMeta().then(() => {
          resolve(this);
        })
      } else if (isPlainObject(args) && this.isValidTag(args)) {
        Object.assign(this, args);
        resolve(this)
      } else {
        reject('TagModel args is invalid')
        // throw new Error('TagModel args is invalid');
      }
    })
  }
  async fetchMeta () {
    try {
      console.log("TagModel -> fetchMeta -> this.id", this.id)
      const response = await wp.tags().id(this.id);
      console.log("TagModel -> fetchMeta -> response", response)
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

