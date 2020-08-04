import { isInteger, isPlainObject, isArray, isEmpty } from 'lodash';
import { CategoryModel, NovelCategoryModel } from '../categories';
import { TagModel,NovelTagModel } from '../tags';
import { MediaModel } from '../media';
import { CommentModel } from '../comments';
import wp from '../../plugins/wpapi';

export default class PostsModel {
  id = null;
  featured_media = null;
  status = 'publish';
  categoriesCollection = [];
  tagsCollection = [];
  featuredMediaModel = {};
  mediaCollection = [];
  commentsCollection = [];

  constructor(args) {
    if (isInteger(args)) {
      this.id = args;
      this.fetchMeta();
    } else if (isPlainObject(args) && this.isValidPost(args)) {
      Object.assign(this, args);
      // 初始化novel相关字段
      this.fetchCategories();
      this.fetchComments();
      this.fetchMedias();
      this.fetchTags();
    } else {
      throw new Error('postsModel args is invalid');
    }
  }
  fetchMeta () {
    wp.posts().id(this.id).then(response => {
      if (this.isValidPost(response)) {
        Object.assign(this, response);
        this.fetchCategories();
        this.fetchComments();
        this.fetchMedias();
        this.fetchTags();
      }
    })
  }
  fetchCategories () {
    if (isArray(this.categories) && this.categories.length) {
      this.categoriesCollection = this.categories.map(id => new CategoryModel(id));
    }
    if (isArray(this.novel_category) && this.novel_category.length) {
      this.categoriesCollection = this.novel_category.map(id => new NovelCategoryModel(id));
    }
  }
  fetchTags () {
    if (isArray(this.tags) && this.tags.length) {
      this.tagsCollection = this.tags.map(id => new TagModel(id));
    }
    if (isArray(this.novel_tag) && this.novel_tag.length) {
      this.tagsCollection = this.novel_tag.map(id => new NovelTagModel(id));
    }
  }
  fetchMedias () {
    if (isInteger(this.featured_media) && this.featured_media !== 0) {
      this.featuredMediaModel = new MediaModel(this.featured_media);
    }
    if (isArray(this.media) && this.media.length) {
      this.mediaCollection = this.media.map(id => new MediaModel(id));
    }
  }
  async fetchComments () {
    var commentIds = await wp.comments().post(this.id).get();
    this.commentsCollection = commentIds.map(id => new CommentModel(id))
  }
  isValidPost (data) {
    return data.id && data.title.rendered;
  }
}

