import wp from '../../plugins/wpapi';
import PostModel from './PostModel';
import { isEmpty } from 'lodash';
import {
  CategoryCollection
} from '../../resource';

const categoryId = Symbol();
let postCollection = null;

export default class PostCollection {

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
  async fetchList (paramKey, paramVal) {
    const posts = paramKey?await wp.posts().param(paramKey, paramVal):await wp.posts();
    console.log("PostCollection -> fetchList -> posts", posts)
    const list = await Promise.complete(posts.map(async (item) => await new PostModel(item)))
    this.list = list;
    return list;
  }
}

