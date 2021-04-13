const { postmetaModel, postsModel } = require('../models');

const { _fields, TYPES } = require('../constants/index.js');

const { db2webData, web2dbData } = require('../utils/transform')
const { searializeQuery } = require('../utils/req')

// 获取媒体库
const read = async (req, res) => {
  const { query } = req;
  if (query.post && query.action === 'thumbnail') {
    return readPostThumbnail(req, res);
  }
  const { limit, offset } = searializeQuery(query);

  if (query.post) {
    query.parent = +query.post;
  }
  
  // 查询type为attachment的媒体资源
  query.type = 'attachment';
  const response = await postsModel.findAndCountAll({
    where: web2dbData(query, TYPES.POSTS, true),
    limit,
    offset,
    order: [['ID', 'DESC']]
  });
  const { count } = response;
  const rows = response.rows.map(item => db2webData(item, TYPES.MEDIA, true));
  return {
    rows,
    _paging: {
      length: rows.length,
      offset,
      limit,
      count
    }
  };
}
// 获取文章相关媒体
const readPostThumbnail = async (req, res) => {
  const { query } = req;
  const { limit, offset } = searializeQuery(query);
  query.key = [
    // '_wp_attached_file',
    // '_wp_attachment_backup_sizes',
    // '_wp_attachment_metadata',
    '_thumbnail_id'
  ];
  // 获取媒体ID
  const postThumbnailResponse = await postmetaModel.findOne({
    where: web2dbData(query, TYPES.POSTMETA, true),
  })
  // 获取
  const posts = await postsModel.findOne({ ID: postThumbnailResponse.post_id });
  // 获取
  return db2webData(posts, TYPES.MEDIA, true);
}

module.exports = {
  read,
}