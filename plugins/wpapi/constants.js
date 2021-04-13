const TYPES = {
  POSTS: 'posts',
  MEDIA: 'media',
  TAGS: 'tags',
  CATEGORIES: 'categories',
  COMMENTS: 'comments',
}

module.exports.TYPES = TYPES;

// post接口返回字段约束
module.exports._fields = {
  [TYPES.POSTS]: [
    'author',
    'categories',
    'date',
    'excerpt',
    'featured_media',
    'id',
    'tags',
    'comment_count',
    'title',
  ],
  [TYPES.MEDIA]: [
    'id',
    'source_url',
    'post',
  ],
  [TYPES.TAGS]: [
    'count',
    'id',
    'name',
    'taxonomy',
    'link',
    '_links.self'
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
    'content',
    'parent',
    'post'
  ]
}