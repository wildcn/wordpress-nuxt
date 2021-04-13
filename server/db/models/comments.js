const Sequelize = require('sequelize');
/**
 * 基于acl的访问控制表，比较简单
 */
const dbName = `comments`;
const columns = {
  comment_ID: {
    type: Sequelize.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  comment_post_ID: Sequelize.BIGINT(20),
  comment_karma: Sequelize.BIGINT(11),
  comment_author: Sequelize.TEXT,
  comment_author_email: Sequelize.STRING,
  comment_author_url: Sequelize.STRING,
  comment_author_IP: Sequelize.STRING,
  comment_agent: Sequelize.STRING,
  comment_approved: Sequelize.STRING,
  comment_date: Sequelize.DATE,
  comment_content: Sequelize.TEXT,
  user_id: Sequelize.BIGINT(20),
  comment_parent: Sequelize.BIGINT(20),
};

module.exports = {
  dbName,
  columns
};