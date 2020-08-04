import { isInteger, isPlainObject, isArray, isEmpty } from 'lodash';
import wp from '../../plugins/wpapi';

export default class MediaModel {
  id = null;
  source_url = null;
  mime_type = null;
  media_details = {};

  constructor(args) {
    if (isInteger(args)) {
      this.id = args;
      this.fetchMeta();
    } else if (isPlainObject(args) && this.isValidMedia(args)) {
      Object.assign(this, args);
    } else {
      throw new Error('MediaModel args is invalid');
    }
  }
  fetchMeta () {
    wp.media().id(this.id).then(response => {
      if (this.isValidMedia(response)) {
        Object.assign(this, response);
      }
    })
  }
  isValidMedia (data) {
    return data.id && data.source_url && data.mime_type;
  }
}

