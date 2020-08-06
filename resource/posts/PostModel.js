import { isInteger, isPlainObject, isArray, isEmpty } from 'lodash';
import { CategoryModel, CategoryCollection } from '../categories';
import { TagModel, TagCollection } from '../tags';
import { MediaModel } from '../media';
import { CommentModel, CommentCollection } from '../comments';
import wp from '../../plugins/wpapi';



const tagCol = TagCollection.getInstance();
const categoriesCol = CategoryCollection.getInstance();
const commentCol = CommentCollection.getInstance();

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
    // 同步是为了SSR能拿到全部数据
    return new Promise((resolve, reject) => {
      if (isInteger(args)) {
        this.id = args;
        this.fetchMeta().then(() => {
          resolve(this);
        })
      } else if (isPlainObject(args) && this.isValidPost(args)) {
        Object.assign(this, args);
        this.init().then(() => {
          resolve(this);
        })
      } else {
        reject('postsModel args is invalid')
      }
    })
  }
  async init () {
    try {
      await this.fetchCategories();
      await this.fetchComments();
      await this.fetchMedias();
      await this.fetchTags();
      return this;
    } catch (err) {
    }
  }
  async fetchContent () {
    const response = await wp.posts({ _fields: 'content' }).id(this.id);
    if (response.content) {
      this.content = response.content;
    }
    return response.content;
  }
  async fetchMeta () {
    const response = await wp.posts().id(this.id);
    if (this.isValidPost(response)) {
      Object.assign(this, response);
      await this.init();
    }
    return this;
  }

  async fetchCategories () {
    const categories = this.categories || [];
    if (categories.length) {
      this.categoriesCollection = await Promise.complete(categories.map(async id => {
        if (categoriesCol.mapList[id]) {
          return categoriesCol.mapList[id]
        }
        return await new CategoryModel(id);
      }))
    }
  }
  async fetchTags () {
    const tags = this.tags || [];
    try {
      this.tagsCollection = await Promise.complete(tags.map(async id => {
        if (tagCol.mapList[id]) {
          return tagCol.mapList[id];
        }
        const response = await new TagModel(id);
        return response
      }))
    } catch (err) {
    }
  }
  async fetchMedias () {
    const media = this.media || [];
    if (isInteger(this.featured_media) && this.featured_media !== 0) {
      this.featuredMediaModel = await new MediaModel(this.featured_media);
    }
    if (media.length) {
      this.mediaCollection = await Promise.complete(media.map(async id => await new MediaModel(id)));
    }

  }
  async fetchComments () {
    if (commentCol.postMapList && commentCol.postMapList[this.id]) {
      this.commentsCollection = commentCol.postMapList[this.id]
    } else {
      const commentIds = await wp.comments().post(this.id).get();
    }
  }
  isValidPost (data) {
    return data.id && data.title.rendered;
  }
}

