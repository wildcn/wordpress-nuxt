import wp from '../../plugins/wpapi';
import TagModel from './TagModel';

export default class NovelTagModel extends TagModel {
  fetchMeta () {
    wp.novelTags().id(this.id).then(response => {
      if (this.isValidTag(response)) {
        Object.assign(this, response);
      }
    })
  }
}