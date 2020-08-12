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
      } else if (isPlainObject(args) && this.isValidComment(args)) {
        Object.assign(this, args);
        resolve(this)
      } else if (isPlainObject(args) && args.content) {
        Object.assign(this, args);
        resolve(this);
      } else {
        reject('CommentModel args is invalid')
        // throw new Error('CommentModel args is invalid');
      }
    })
  }
  async fetchMeta () {
    const response = await wp.comments().id(this.id);
    if (this.isValidComment(response)) {
      Object.assign(this, response);
    }
  }
  static async createComment (param = {}) {
    if (!param.post) {
      throw new Error('need post');
    }
    if (!param.content) {
      throw new Error('need content');
    }

    const response = await wp.comments().create(param)
    return response;
  }
  isValidComment (data) {
    return data.id && data.content && data.author_name;
  }
}

