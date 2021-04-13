import { isInteger, isPlainObject, isArray, isEmpty } from 'lodash';
import wpr from '../../plugins/wp-xhr';

export default class MediaModel {
  id = null;
  source_url = null;
  media_details = {};

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
        reject('MediaModel args is invalid')
        // throw new Error('MediaModel args is invalid');
      }
    })
  }
  async fetchMeta () {
    // 此处id为wp_posts表内的id
    const response = await wpr.media.read({ id: this.id })
    if (this.isValidMedia(response)) {
      Object.assign(this, response);
    }
  }
  isValidMedia (data) {
    return data.id && data.source_url;
  }
}

