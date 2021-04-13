import wpr from '../../plugins/wp-xhr';
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
    limit: 10,
    offset: 0
  }
  list = []
  stickyList = []
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
    if (this.list.length === (this._paging && this._paging.count)) {
      throw new Error('no data')
    }
    if (this.list.length) {
      this.param.offset += this.param.limit
    }

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
      ], 'postCollection/prepareMaterial'
    )
  }
  async fetchList (options = {}) {

    const params = JSON.parse(JSON.stringify(options));
    // try {
    //   await this.prepareMaterial();
    // } catch (err) {
    //   console.error("PostCollection -> fetchList -> err", err)
    // }
    let param = Object.assign({}, this.param, params);

    if (param.categories && Array.isArray(param.categories)) {
      param.categories = param.categories.join(',')
    }

    const response = await wpr.posts.read(param);
    this._paging = response._paging;
    try {
      const list = await Promise.complete(response.rows.map((item) => new PostModel(item)), 'postCollectin/fetchList')
      this.list = [].concat(this.list, list);
      this.list = uniqBy(this.list, 'id');
      this.fetchMap();
      return list
    } catch (err) {
      console.error("PostCollection -> fetchList -> err", err)
    }
  }
  // 获取置顶文章列表
  async fetchStickyPosts (opts = { limit: 5, skip: 0 }) {
    const { limit = 5, skip = 0 } = opts;
    const options = await wpr.options.read({ option_name: 'sticky_posts' });
    if (options.rows && options.rows.length) {
      const [{ value }] = options.rows;
      function searializeStickyOptions (val) {
        const validData = val.match(/\d+/g);
        const count = validData.shift();
        const postIds = validData.filter((item, index) => index % 2 !== 0).sort((a, b) => b - a)
        // 跳过skip
        if (opts.skip) {
          const idx = postIds.indexOf(opts.skip.toString());
          postIds.splice(idx, 1);
        }
        return {
          count,
          postIds
        }
      }

      const { postIds, count } = searializeStickyOptions(value);
      const ids = postIds.slice(0, opts.limit);
      const { rows } = await wpr.posts.read({ id: ids });
      return {
        rows,
        count,
        limit,
        skip
      }
    }
  }
  fetchMap (options) {
    this.mapList = this.list.reduce((pre, next) => Object.assign(pre, { [next.id]: next }), {})
    return this.mapList;
  }
}

