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
    // 获取tagid
    const ids = await term_taxonomyModel.findAndCountAll({
      where: {
        taxonomy: 'post_tag',
      },
      limit,
      offset,
    })
    const { count } = ids;
    const categoryById = ids.rows.reduce((obj, item) => Object.assign(obj, {
      [item.term_id]: {
        parent: item.parent,
        count: item.count,
        term_id: item.term_id
      }
    }), {});

    const termIds = Object.keys(categoryById);
    // 获取tag详情 @TODO 关联表查询
    const res = await termsModel.findAll({
      where: {
        term_id: termIds
      },
    });
    const response = res.map(item => {
      const id = item.term_id;
      const { parent, count } = categoryById[id];
      return {
        term_id: id,
        name: item.name,
        slug: item.slug,
        term_group: item.term_group,
        parent,
        count
      }
    })


    const fields = query._fields || _fields[TYPES.TAGS];
    const rows = await Promise.all(response.map(async item => {
      const Model = new CategoriesController(item);
      await Model.fetchMeta();
      return Model.filterData({ fields });
    }))
    return {
      rows,
      _paging: {
        length:rows.length,
        count,
        offset,
        limit
      }
    };

  } catch (err) {
    return err;
  }
}

module.exports = {
  read,
}