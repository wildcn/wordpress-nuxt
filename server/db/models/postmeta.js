const Sequelize = require('sequelize');
/**
 * 基于acl的访问控制表，比较简单
 */
const dbName = `postmeta`;
const columns = {
  meta_id: {
    type: Sequelize.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  post_id: Sequelize.BIGINT(20),
  meta_key: Sequelize.TEXT,
  meta_value: Sequelize.TEXT,
};

module.exports = {
  dbName,
  columns
};