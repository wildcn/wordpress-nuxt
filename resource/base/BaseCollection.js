const categoryId = Symbol();
let baseCollection = null;

export default class BaseCollection {
  constructor(id) {
    if (id !== categoryId) {
      throw new Error(`Can not create a BaseCollection instance.`);
    }
  }
  static getInstance () {
    if (baseCollection === null) {
      baseCollection = new BaseCollection(categoryId);
    }
    return baseCollection;
  }
  async fetchMap () {
    if (!this.list.length) {
      await this.fetchList();
    }
    this.mapList = this.list.reduce((pre, next) => Object.assign(pre, { [next.id]: next }), {})
    return this.mapList;
  }
}

