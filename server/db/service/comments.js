const { commentsModel } = require('../models');
const CommentsController = require('../controller/Comments');

const { _fields, TYPES } = require('../constants/index.js');

const { web2dbData } = require('../utils/transform')
const { searializeQuery } = require('../utils/req')

// 获取
const read = async (req, res) => {
  const { query } = req;

  const { limit, offset } = searializeQuery(query);
 
  // 获取栏目指定文章
  const response = await commentsModel.findAndCountAll({
    where: web2dbData(query, TYPES.COMMENTS),
    limit,
    offset,
    order: [['comment_ID', 'DESC']]
  });
  const { count } = response;
  const rows = await genarateResponse(response.rows, query);
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

const create = async (req, res) => {
  const body = req.body;
  body.date = body.date || new Date();
  body.ip = req.ip;
  body.ua = req.headers["user-agent"].toLowerCase();

  const payload = web2dbData(req.body, TYPES.COMMENTS);
  const response = await commentsModel.create(payload)
  return response;
}
const genarateResponse = async (res, query = {}) => {
  const fields = query._fields || _fields[TYPES.COMMENTS];
  const response = await Promise.all(res.map(async item => {
    const Model = new CommentsController(item);
    await Model.fetchMeta();
    return Model.filterData({ fields });
  }))
  return response;
}
module.exports = {
  read,
  create
}