import wp from '../../plugins/wpapi';
import TagModel from './TagModel';

export default class NovelTagModel extends TagModel {
  async fetchMeta () {
    const response = await wp.novelTags().id(this.id);
    if (this.isValidTag(response)) {
      Object.assign(this, response);
    }
  }
}