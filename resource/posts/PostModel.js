import { isInteger, isPlainObject, isArray, isEmpty } from 'lodash';
import { CategoryModel, CategoryCollection } from '../categories';
import { TagModel, TagCollection } from '../tags';
import { MediaModel, MediaCollection } from '../media';
import { CommentModel, CommentCollection } from '../comments';
import wp, { wps } from '../../plugins/wpapi';



const tagCol = TagCollection.getInstance();
const categoriesCol = CategoryCollection.getInstance();
const commentCol = CommentCollection.getInstance();
const mediaCol = MediaCollection.getInstance();

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
      await this.fetchMedias();
      await this.fetchTags();
      // await this.fetchComments();
      return this;
    } catch (err) {
    }
  }
  async fetchContent () {
    try {
      const response = await wp.posts({ _fields: 'content' }).id(this.id);
      if (response.content) {
        this.content = response.content;
      }
      return response.content;
    } catch (err) {
      console.log(err)
    }
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
        if (response.name) {
          return response
        }
        throw new Error(response);
      }))
    } catch (err) {
    }
  }
  async fetchMedias () {
    let media = this.media || [];
    if (isInteger(this.featured_media) && this.featured_media !== 0) {
      media = [].concat(media, this.featured_media);
    }
    if (media.length) {
      this.mediaCollection = await Promise.complete(media.map(async id => {
        const response = mediaCol.mapList[id] || await new MediaModel(id);
        if (response.id === this.featured_media) {
          this.featuredMediaModel = response;
        }
        if (response.source_url) {
          return response
        }
        throw new Error(response);
      }));
    }

  }
  async fetchComments () {
    if (commentCol.postMapList && commentCol.postMapList[this.id]) {
      this.commentsCollection = commentCol.postMapList[this.id]
    } else {
      const commentIds = await wps.comments.post(this.id);
    }
  }
  isValidPost (data) {
    return data.id && data.title.rendered;
  }
}

