import { isInteger, isPlainObject, isArray, isEmpty } from 'lodash';
import wpr from '../../plugins/wp-xhr';

export default class TagModel {
  id = null;
  name = null;

  constructor(args) {
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
      const response = await wpr.tags.read({ id: this.id })
      const res = response.rows && response.rows[0]
      if (this.isValidTag(res)) {
        Object.assign(this, res);
      }
    } catch (err) {
      console.error(err)
    }
  }

  isValidTag (data) {
    return data && data.id && data.name;
  }
}

