const { postsModel } = require('../models');
const PostsController = require('../controller/Posts');
const Sequelize = require('sequelize');
const { _fields, TYPES } = require('../../../constants/api');
const { web2db, db2webData, web2dbData } = require('../utils/transform')
const { searializeQuery } = require('../utils/req')
const { read: readTermRelationships } = require('./term_relationships');

const cache = require('../../cache');
// 获取
const read = async (req, res) => {
  const { query = {} } = req;

  const fields = query._fields || _fields[TYPES.POSTS];
  const exclude = !fields.content ? ['post_content'] : [];

  const { limit, offset } = searializeQuery(query);

  query.type = query.type || 'post';
  query.status = query.status || 'publish';

  // 获取栏目指定文章
  let termTaxonomyIds = query.categories || query.tags;
  if (termTaxonomyIds) {

    const res = await readByTaxonomys({ limit, fields, offset, termTaxonomyIds, query })
    const rows = await genaratePostList(res, query);
    return {
      rows,
      _paging: {
        limit,
        offset,
        length: rows.length
      }
    };
  } else if (query.id) {
    const payload = {
      where: web2dbData(query, TYPES.POSTS, true),
      order: [['ID', 'DESC']],
    };
    if (fields.indexOf('content') !== -1) {
      payload.attributes = web2db([].concat(fields), TYPES.POSTS)
    }
    let { count, rows } = await postsModel.findAndCountAll(payload);
    rows = await genaratePostList(rows, { _fields: fields });
    return {
      rows: rows.map(item => db2webData(item, TYPES.POSTS)),
      _paging: {
        count,
        limit,
        length: rows.length,
        offset
      }
    }
  } {
    const res = await postsModel.findAndCountAll({
      where: web2dbData(query, TYPES.POSTS, true),
      limit,
      offset,
      order: [['ID', 'DESC']],
      attributes: {
        exclude
      }
    });
    const { count } = res;
    const rows = await genaratePostList(res.rows, query);
    return {
      rows,
      _paging: {
        length: rows.length,
        limit,
        offset,
        count
      }
    };
  }
}

// 获取栏目文章
const readByTaxonomys = async ({ limit, offset, fields, termTaxonomyIds, query }) => {
  if (!Array.isArray(termTaxonomyIds)) {
    termTaxonomyIds = termTaxonomyIds.split(',');
  }
  const exclude = !fields.content ? ['post_content'] : [];
  // 获取栏目关联文章id
  const postIds = await readTermRelationships({
    limit,
    offset,
    id: termTaxonomyIds
  });

  const { count } = postIds;

  query.id = postIds.rows.map(item => item.object_id);
  const response = await postsModel.findAll({
    where: web2dbData(query, TYPES.POSTS, true),
    order: [['ID', 'DESC']],
    attributes: {
      exclude
    }
  })
  return response
}
const genaratePostList = async (res, query = {}) => {
  const fields = query._fields || _fields[TYPES.POSTS];
  const response = await Promise.all(res.map(async item => {
    const Model = new PostsController(item);
    await Model.fetchMeta();
    return Model.filterData({ fields });
  }))
  return response;
}

module.exports = {
  read,
}