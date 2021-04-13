
const Sequelize = require('sequelize');
const { term_relationshipsModel } = require('../models');
const { _fields, TYPES } = require('../../../constants/api');
const { searializeQuery } = require('../utils/req')
const { web2dbData } = require('../utils/transform')

const read = async (req, res) => {
  const query = req.query || req;

  const fields = query._fields || _fields[TYPES.TERM_RELATIONSHIPS];

  const { limit, offset } = searializeQuery(query);

  const where = web2dbData(query,TYPES.TERM_RELATIONSHIPS, true);
  // 获取栏目关联文章id
  const response = await term_relationshipsModel.findAndCountAll({
    where,
    limit,
    offset,
    // 根据object_id去重，避免重复文章id
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('object_id')), 'object_id'],
    ],
    order: [['object_id', 'DESC']]
  })

  return response;
}

module.exports = {
  read
}