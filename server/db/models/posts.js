const Sequelize = require('sequelize');
/**
 * 基于acl的访问控制表，比较简单
 */
const dbName = `posts`;
const columns = {
  ID: {
    type: Sequelize.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  post_author: Sequelize.BIGINT(20),
  post_date: Sequelize.DATE,
  post_modified: Sequelize.DATE,
  post_content: Sequelize.TEXT,
  post_title: Sequelize.TEXT,
  post_excerpt: Sequelize.TEXT,
  guid: Sequelize.TEXT,
  post_status: Sequelize.STRING,
  post_status: Sequelize.STRING,
  post_parent: Sequelize.STRING,
  post_type: Sequelize.STRING,
  post_name: Sequelize.STRING,
  comment_count: Sequelize.BIGINT(20),
};

module.exports = {
  dbName,
  columns
};