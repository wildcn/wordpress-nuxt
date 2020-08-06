import wp from '../../plugins/wpapi';
import TagModel from './TagModel';

const tagId = Symbol();
let categoryCollection = null;

export default class TagCollection {
  map = {};
  list = [];
  requestStatus = false;
  mapList = {}
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
  async fetchList () {
    const tags = await wp.tags();
    const tagsList = await Promise.complete(tags.map(async tag => await new TagModel(tag)));
    this.list = tagsList;
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

