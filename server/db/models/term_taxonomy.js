const Sequelize = require('sequelize');
/**
 * 基于acl的访问控制表，比较简单
 */
const dbName = `term_taxonomy`;
const columns = {
  term_taxonomy_id: {
    type: Sequelize.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  term_id: Sequelize.BIGINT(20),
  parent: Sequelize.BIGINT(20),
  count: Sequelize.BIGINT(20),
  taxonomy: Sequelize.TEXT,
  description: Sequelize.TEXT,
};

module.exports = {
  dbName,
  columns
};