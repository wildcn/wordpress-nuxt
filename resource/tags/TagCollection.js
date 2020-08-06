import wp from '../../plugins/wpapi';
import TagModel from './TagModel';
import NovelTagModel from './NovelTagModel';

const tagId = Symbol();
let categoryCollection = null;

export default class TagCollection {
  map = {};
  list = [];
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
          resolve(TagCollection.getInstance().getTagModel(id, novel));
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
    const tags = await wp.tags();

    const novelTagsList = await Promise.complete(novelTags.map(async tag => await new NovelTagModel(tag)));
    const tagsList = await Promise.complete(tags.map(async tag=>await new TagModel(tag)));

    
    this.list = [].concat(novelTagsList, tagsList);
  }
  async fetchMap () {
    if (!this.list.length) {
      await this.fetchList();
    }
    this.mapList = await this.list.reduce(async (pre, next) => {
      pre = await pre;
      pre[next.id] = next;
      return pre;
    }, {})
    return this.mapList;
  }
}

