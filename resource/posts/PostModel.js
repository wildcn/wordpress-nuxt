import { isInteger, isPlainObject, isArray, isEmpty } from 'lodash';
import { CategoryModel, NovelCategoryModel, CategoryCollection } from '../categories';
import { TagModel, NovelTagModel, TagCollection } from '../tags';
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
        // 初始化novel相关字段
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
      console.log("PostsModel -> init -> err", err)
    }
  }
  async fetchContent(){
    const response = await wp.posts({_fields:'content'}).id(this.id);
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
    this.categories = this.categories || [];
    this.novel_category = this.novel_category || [];
    const categories = [].concat(this.categories, this.novel_category)
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
    this.tags = this.tags || [];
    this.novel_tag = this.novel_tag || [];
    const tags = [].concat(this.tags, this.novel_tag);
    this.tagsCollection = await Promise.complete(tags.map(async id => {
      if (tagCol.mapList[id]) {
        console.log("PostsModel -> fetchTags -> id", id)
        return tagCol.mapList[id];
      }
      return new TagModel(id)
    }))
    console.log("PostsModel -> fetchTags -> tagsCollection", this.tagsCollection)
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
    }else{
      const commentIds = await wp.comments().post(this.id).get();
      console.log("PostsModel -> fetchComments -> commentIds", commentIds)
    }
  }
  isValidPost (data) {
    return data.id && data.title.rendered;
  }
}

