import { isInteger, isPlainObject, isArray, isEmpty } from 'lodash';
import wp from '../../plugins/wpapi';

export default class CommentModel {
  id = null;
  content = null;

  constructor(args) {
    return new Promise((resolve, reject) => {
      if (isInteger(args)) {
        this.id = args;
        this.fetchMeta().then(() => {
          resolve(this);
        })
      } else if (isPlainObject(args) && this.isValidMedia(args)) {
        Object.assign(this, args);
        resolve(this)
      } else {
        reject('CommentModel args is invalid')
        // throw new Error('CommentModel args is invalid');
      }
    })
  }
  async fetchMeta () {
    const response = await wp.comments().id(this.id);
    if (this.isValidMedia(response)) {
      Object.assign(this, response);
    }
  }
  isValidMedia (data) {
    return data.id && data.content && data.author_name;
  }
}

