const Sequelize = require('sequelize');
/**
 * 基于acl的访问控制表，比较简单
 */
const dbName = `options`;
const columns = {
  option_id: {
    type: Sequelize.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  option_name: Sequelize.TEXT,
  option_value: Sequelize.TEXT,
  autoload: Sequelize.TEXT,
};

module.exports = {
  dbName,
  columns
};