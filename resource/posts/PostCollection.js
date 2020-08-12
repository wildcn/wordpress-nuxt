import wp from '../../plugins/wpapi';
import PostModel from './PostModel';
import { isEmpty, isPlainObject, uniqBy } from 'lodash';
import { CategoryModel, CategoryCollection } from '../categories';
import { TagModel, TagCollection } from '../tags';
import { MediaModel, MediaCollection } from '../media';
import { CommentModel, CommentCollection } from '../comments';

const categoryId = Symbol();
let postCollection = null;


const tagCollection = TagCollection.getInstance()
const commentCollection = CommentCollection.getInstance()
const categoryCollection = CategoryCollection.getInstance();
const mediaCollection = MediaCollection.getInstance();

export default class PostCollection {
  param = {
    per_page: 10,
    page: 1
  }
  list = []
  constructor(id) {
    if (id !== categoryId) {
      throw new Error(`Can not create a PostCollection instance.`);
    }
  }
  static getInstance () {
    if (postCollection === null) {
      postCollection = new PostCollection(categoryId);
    }

    return postCollection;
  }
  async more (options) {
    if (this.list.length === (this._paging && this._paging.total)) {
      throw new Error('no data')
    }
    this.list.length !== 0 && ++this.param.page;
    const moreList = this.fetchList(options);
    return moreList;
  }
  // 准备文章素材，避免接口请求过多
  async prepareMaterial () {
    await Promise.complete(
      [// 获取标签
        tagCollection.more(),
        // 获取评论
        commentCollection.more(),
        // 获取栏目
        categoryCollection.more(),
        // 获取媒体
        mediaCollection.more()
      ],'postCollection/prepareMaterial'
    )
  }
  async fetchList (options = {}) {
    try {
      await this.prepareMaterial();
    } catch (err) {
    console.log("PostCollection -> fetchList -> err", err)
    }
    let param = Object.assign({}, this.param, options);
  

    const response = await wp.posts().param(param);
    this._paging = response._paging;
    const list = await Promise.complete(response.map(async (item) => await new PostModel(item)),'postCollectin/fetchList')
    this.list = [].concat(this.list, list);
    this.list = uniqBy(this.list, 'id');
    this.fetchMap();
    return list
  }
  fetchMap (options) {
    this.mapList = this.list.reduce((pre, next) => Object.assign(pre, { [next.id]: next }), {})
    return this.mapList;
  }
}

