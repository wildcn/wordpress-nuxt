import CategoryModel from './CategoryModel';
import wp from '../../plugins/wpapi';

export default class NovelCategoryModel extends CategoryModel {
  fetchMeta () {
    wp.novelCategories().id(this.id).then(response => {
      if (this.isValidCategory(response)) {
        Object.assign(this, response);
        this.fetchMedias();
      }
    })
  }
}