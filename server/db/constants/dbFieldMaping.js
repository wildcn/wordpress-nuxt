// web对数据库字段的映射
const { TYPES } = require('../../../constants/api');

const webFields = {
  [TYPES.POSTS]: {
    'author': 'post_author',
    'date': 'post_date',
    'excerpt': 'post_excerpt',
    'id': 'ID',
    'comment_count': 'comment_count',
    'title': 'post_title',
    'content': 'post_content',
    'status': 'post_status',
    'type': 'post_type',
    'guid':'guid',
    'parent':'post_parent'
  },
  [TYPES.MEDIA]: {
    'id': 'ID',
    'url':'guid'
  },
  [TYPES.TERM_RELATIONSHIPS]: {
    'id': 'term_taxonomy_id',
    'post': 'object_id',
    'order': 'term_order'
  },
  [TYPES.CATEGORIES]: {
    'id': 'term_id',
  },
  [TYPES.TAGS]: {
    'id': 'term_id',
  },
  [TYPES.COMMENTS]: {
    'author_name': 'comment_author',
    'author_email': 'comment_author_email',
    'author_url': 'comment_author_url',
    'id': 'comment_ID',
    'ip': 'comment_author_IP',
    'date': 'comment_date',
    'content': 'comment_content',
    'parent': 'comment_parent',
    'ua': 'comment_agent',
    'post': 'comment_post_ID'
  },
  [TYPES.OPTIONS]: {
    'id': 'option_id',
    'name': 'option_name',
    'value': 'option_value'
  },
  [TYPES.POSTMETA]: {
    'id': 'meta_id',
    'post': 'post_id',
    'key': 'meta_key',
    'value': 'meta_value'
  }
}

const dbFields = {};
Object.keys(webFields).forEach(type => {
  dbFields[type] = {};
  Object.keys(webFields[type]).forEach(webKey => {
    dbFields[type][webFields[type][webKey]] = webKey;
  })
})

module.exports.dbFields = dbFields;
module.exports.webFields = webFields