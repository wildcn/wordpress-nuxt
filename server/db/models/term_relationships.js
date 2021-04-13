const Sequelize = require('sequelize');
/**
 * 基于acl的访问控制表，比较简单
 */
const dbName = `term_relationships`;
const columns = {
  object_id: {
    type: Sequelize.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  term_taxonomy_id: Sequelize.BIGINT(10),
  term_order: Sequelize.BIGINT(11),
};

module.exports = {
  dbName,
  columns
};