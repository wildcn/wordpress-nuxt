import { isInteger, isPlainObject, isArray, isEmpty } from 'lodash';
import wp from '../../plugins/wpapi';
import PostModel from './PostModel';
import { _fields } from './constants';
import {
  CategoryCollection
} from '../../resource';

const categoryId = Symbol();
let postCollection = null;

export default class PostCollection {

  constructor(id) {
    if (id !== categoryId) {
      throw new Error(`Can not create a WbItemCollection instance.`);
    }
  }
  static getInstance () {
    if (postCollection === null) {
      postCollection = new CategoryCollection(categoryId);
    }

    return postCollection;
  }
  async fetchList () {
    const posts = await wp.posts()
    const novel = await wp.novel()
    const list = [].concat(posts, novel).map((item) => new PostModel(item))
    return list;
  }

}

