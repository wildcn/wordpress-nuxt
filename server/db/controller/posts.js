const { 
  postsModel,
  postmetaModel,
  term_relationshipsModel,
  term_taxonomyModel,
  termsModel
} = require('../models');

class PostsController {
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
    this.id = this._data.ID;
    this.date = this._data.post_date;
    this.modified = this._data.post_modified;
    this.slug = this._data.post_name;
    this.status = this._data.post_status;
    this.type = this._data.post_type;
    this.title = this._data.post_title;
    this.content = encodeURIComponent(this._data.post_content);
    this.excerpt = this._data.post_excerpt;
    this.author = this._data.post_author;
    this.parent = this._data.post_parent;
    this.ping_status = this._data.ping_status;
    this.comment_count = this._data.comment_count;

    try {
      await this.getThumbnailId();
      await this.fetchTaxonomy();
    } catch (err) {
    }
    this.getCommentIds();
  }
  // 获取特色图像 wp_postmeta _thumbnail_id=post_id
  async getThumbnailId () {
    const featured_mediaIds = await postmetaModel.findAll({
      where: {
        meta_key: '_thumbnail_id',
        post_id: this.id
      },
      attributes: ['meta_value']
    })
    if (featured_mediaIds.length) {
      this.featured_media_id = +featured_mediaIds[0].meta_value;
      const featured_medias = await postsModel.findAll({
        where: {
          ID: this.featured_media_id,
          post_type: 'attachment',
        },
        attributes: ['guid']
      })
      if (featured_medias.length) {
        this.featured_media = featured_medias[0].guid
      }
    }

  }
  // 获取分类标签 (	term_taxonomy_id) wp_term_relationships => object_id=id ，然后到wp_term_taxonomy获取taxonomy区分分类和标签
  async fetchTaxonomy () {
    const termTaxonomyIds = await term_relationshipsModel.findAll({
      where: {
        object_id: this.id
      },
      attributes: ['term_taxonomy_id']
    })
    if (termTaxonomyIds.length) {
      const termTaxonomy = await term_taxonomyModel.findAll({
        where: {
          term_taxonomy_id: termTaxonomyIds.map(item => item.term_taxonomy_id)
        },
        attributes: ['term_id', 'taxonomy']
      })
      if (termTaxonomy.length) {
        const tagIds = [];
        const categoryIds = [];
        termTaxonomy.forEach(({ taxonomy, term_id }) => {
          switch (taxonomy) {
            case 'post_tag':
              tagIds.push(term_id);
              break;
            case 'category':
              categoryIds.push(term_id);
              break;
          }
        })
        if (tagIds.length) {
          this.tags = await Promise.all(tagIds.map(async term_id => {
            const response = await termsModel.findAll({
              where: {
                term_id
              },
              attributes: ['term_id', 'name']
            })
            return {
              id: response[0].term_id,
              name: response[0].name
            };
          }))
        }
        if (categoryIds.length) {
          this.categories = await Promise.all(categoryIds.map(async term_id => {
            const response = await termsModel.findAll({
              where: {
                term_id
              },
              attributes: ['term_id', 'name']
            })
            return {
              id: response[0].term_id,
              name: response[0].name
            };
          }))
        }
      }
    }
  }
  // 获取comment (comment_ID) wp_comments comment_post_ID=id
  getCommentIds () { }
}

module.exports = PostsController;