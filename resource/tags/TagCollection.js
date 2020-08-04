import { isInteger, isPlainObject, isArray, isEmpty } from 'lodash';
import wp from '../../plugins/wpapi';
import TagModel from './TagModel';
import NovelTagModel from './NovelTagModel';

const tagId = Symbol();
let categoryCollection = null;

export default class TagCollection {
  map = undefined;
  requestStatus = false;
  constructor(id) {
    if (id !== tagId) {
      throw new Error(`Can not create a WbItemCollection instance.`);
    }
  }
  static getInstance () {
    if (categoryCollection === null) {
      categoryCollection = new TagCollection(tagId);
    }

    return categoryCollection;
  }
  async getTagModel (id, novel) {
    if (this.requestStatus) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(TagCollection.getTagModel(id, novel));
        }, 1000);
      })
    }
    if (!this.map) {
      this.requestStatus = true;
      this.map = await this.fetchList();
      this.requestStatus = false;
    }
    if (this.map[id]) {
      return this.map[id]
    }
    return novel ? new NovelTagModel(id) : new TagModel(id);
  }
  async fetchList () {
    const novelTags = await wp.novelTags();
    const tags = await wp.tags()
    this.map = [].concat(novelTags, tags).reduce((pre, next) => {
      pre[next.id] = new TagModel(next);
      return pre;
    }, {})
  }
}

