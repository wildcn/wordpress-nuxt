
class CommentsController {
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
    this.id = this._data.comment_ID;
    this.post = this._data.comment_post_ID;
    this.author_name = this._data.comment_author;
    this.author_email = this._data.comment_author_email;
    this.author_url = this._data.comment_author_url;
    this.date = this._data.comment_date;
    this.parent = this._data.comment_parent;
    this.content = encodeURIComponent(this._data.comment_content);
    this.user_id = this._data.user_id;
    this.ip = this._data.comment_author_IP;
  }
}

module.exports = CommentsController;