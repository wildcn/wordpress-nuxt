const { optionsModel } = require('../models');

const { _fields, TYPES } = require('../constants/index.js');

const { db2webData } = require('../utils/transform')
const { searializeQuery } = require('../utils/req')

// 获取
const read = async (req, res) => {
  const { query } = req;
  if (!query) {
    return undefined;
  }
  const limit = query.limit ? +query.limit : 10;
  delete query.limit;

  const offset = query.offset ? +query.offset : 0;
  delete query.offset;

  // 获取栏目指定文章
  const response = await optionsModel.findAndCountAll({
    where: query,
    limit,
    offset,
    order: [['option_id', 'DESC']]
  });
  const { count } = response;
  const rows = response.rows.map(item => db2webData(item, TYPES.OPTIONS));
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

module.exports = {
  read,
}