import { isInteger, isPlainObject, isArray, isEmpty } from 'lodash';
import { CategoryModel, CategoryCollection } from '../categories';
import { TagModel, TagCollection } from '../tags';
import { MediaModel, MediaCollection } from '../media';
import { CommentModel, CommentCollection } from '../comments';
import wpr from '../../plugins/wp-xhr';



const tagCol = TagCollection.getInstance();
const categoriesCol = CategoryCollection.getInstance();
const commentCol = CommentCollection.getInstance();
const mediaCol = MediaCollection.getInstance();

export default class PostsModel {
  id = null;
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
        resolve(this);
      } else {
        reject('postsModel args is invalid')
      }
    })
  }
  async fetchContent () {
    try {
      const { rows } = await wpr.posts.read({ _fields: ['content', 'id'], id: this.id });
      if (rows[0].content) {
        this.content = decodeURIComponent(rows[0].content)
      }
      return this.content;
    } catch (err) {
      console.error(err)
    }
  }
  async fetchMeta () {
    const response = await wpr.posts.read({ id: this.id });
    const item = response.rows[0];
    if (this.isValidPost(item)) {
      Object.assign(this, item);
      // await this.init();
    }
    return this;
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
      }), 'fetchMedias');
    }
    return;

  }
  // 获取评论
  async fetchComments () {
    const { rows, _paging } = await wpr.comments.read({ post: this.id });
    this.commentsCollection = rows;
    this.commentsPaging = _paging;
  }
  async createComment (param) {
    param.post = this.id;
    wp.comments().create(param).then(data => {
    })
  }
  isValidPost (data) {
    return data.id && data.title;
  }
}

