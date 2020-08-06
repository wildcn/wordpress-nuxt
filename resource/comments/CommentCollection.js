import { isInteger, isPlainObject, isArray, isEmpty } from 'lodash';
import wp from '../../plugins/wpapi';
import CommentModel from './CommentModel';

const categoryId = Symbol();
let categoryCollection = null;

export default class CommentCollection {
  list = [];
  constructor(id) {
    if (id !== categoryId) {
      throw new Error(`Can not create a CommentCollection instance.`);
    }
  }
  static getInstance () {
    if (categoryCollection === null) {
      categoryCollection = new CommentCollection(categoryId);
    }

    return categoryCollection;
  }
  async fetchList () {
    const comments = await wp.comments();
    this.list = await Promise.complete(comments.map(async id => await new CommentModel(id)));
    return this.list
  }
  async fetchMap () {
    if (!this.list.length) {
      await this.fetchList();
    }
    this.mapList = this.list.reduce((pre, next) => Object.assign(pre, { [next.id]: next }), {})
    this.postMapList = this.list.reduce((pre, next) => {
      pre[next.post] = pre[next.post] || [];
      pre[next.post].push(next);
      return pre;
    }, {})
    return this.mapList;
  }
}

