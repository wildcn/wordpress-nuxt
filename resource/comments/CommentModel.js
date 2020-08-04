import { isInteger, isPlainObject, isArray, isEmpty } from 'lodash';
import wp from '../../plugins/wpapi';

export default class CommentModel {
  id = null;
  content = null;

  constructor(args) {
    if (isInteger(args)) {
      this.id = args;
      this.fetchMeta();
    } else if (isPlainObject(args) && this.isValidMedia(args)) {
      Object.assign(this, args);
    } else {
      throw new Error('CommentModel args is invalid');
    }
  }
  fetchMeta () {
    wp.comments().id(this.id).then(response => {
      if (this.isValidMedia(response)) {
        Object.assign(this, response);
      }
    })
  }
  isValidMedia (data) {
    return data.id && data.content && data.author_name;
  }
}

