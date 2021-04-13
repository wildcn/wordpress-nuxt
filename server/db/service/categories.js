const { termsModel, term_taxonomyModel } = require('../models');
const CategoriesController = require('../controller/Categories');

const { _fields, TYPES } = require('../constants/index.js');
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

  try {
    const categoryIds = await term_taxonomyModel.findAndCountAll({
      where: {
        taxonomy: 'category',
      },
      limit,
      offset,
    })
    const { count } = categoryIds;
    const categoryById = categoryIds.rows.reduce((obj, item) => Object.assign(obj, {
      [item.term_id]: {
        parent: item.parent,
        count: item.count,
        term_id: item.term_id
      }
    }), {});

    const termIds = Object.keys(categoryById);
    const res = await termsModel.findAll({
      where: {
        term_id: termIds
      },
    });
    const rows = res.map(item => {
      const id = item.term_id;
      const { parent, count } = categoryById[id];
      return {
        id,
        name: item.name,
        parent,
        count
      }
    })
    return {
      rows,
      _paging: {
        length: rows.length,
        offset,
        limit,
        count
      }
    };

  } catch (err) {
    return err;
  }
}

module.exports = {
  read,
}