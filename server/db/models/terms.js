const Sequelize = require('sequelize');
/**
 * 基于acl的访问控制表，比较简单
 */
const dbName = `terms`;
const columns = {
  term_id: {
    type: Sequelize.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  name: Sequelize.TEXT,
  slug: Sequelize.TEXT,
  term_group: Sequelize.BIGINT(10),
};

module.exports = {
  dbName,
  columns
};