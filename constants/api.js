
const TYPES = {
  POSTS: 'posts',
  MEDIA: 'media',
  TAGS: 'tags',
  CATEGORIES: 'categories',
  COMMENTS: 'comments',
  OPTIONS: 'options',
  TERM_RELATIONSHIPS: 'term_relationships',
  POSTMETA: 'postmeta'
}
module.exports.TYPES = TYPES;

module.exports.BASE_URL = '/wp/'
// post接口返回字段约束
module.exports._fields = {
  [TYPES.POSTS]: [
  'author',
    'categories',
    'date',
    'excerpt',
    'featured_media',
    'id',
    'guid',
    'tags',
    'comment_count',
    'status',
    'title',
  ],
  [TYPES.TERM_RELATIONSHIPS]: [
    'post',
    'id',
    'order'
  ],
  [TYPES.MEDIA]: [
    'id',
    'guid'
  ],
  [TYPES.TAGS]: [
    'count',
    'id',
    'name',
  ],
  [TYPES.CATEGORIES]: [
    'count',
    'id',
    'name',
    'parent'
  ],
  [TYPES.COMMENTS]: [
    'user_id',
    'author_name',
    'author_email',
    'id',
    'date',
    'ua',
    'content',
    'parent',
    'post'
  ],
  [TYPES.OPTIONS]: [
    'id',
    'name',
    'value',
    'autoload',
  ],
  [TYPES.POSTMETA]: [
    'id',
    'post',
    'key',
    'value'
  ]
}