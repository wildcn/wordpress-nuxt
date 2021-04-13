class CategoriesController {
  constructor(data) {
    this._data = data;
  }
  async fetchMeta () {
    await this.prepareResponse();
  }
  // 过滤data
  filterData (opts = {}) {
    if (!opts.fields) {
      return this;
    }
    const result = {};
    [].concat(opts.fields).forEach(key => {
      result[key] = this[key];
    })
    return result;
  }
  async prepareResponse () {
    this.id = this._data.term_id;
    this.name = this._data.name;
    this.slug = this._data.slug;
    this.parent = this._data.parent;
    this.count = this._data.count;
    this.term_group = this._data.term_group;
  }
}

module.exports = CategoriesController;