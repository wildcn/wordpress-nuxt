export const TYPES = {
  POSTS: 'posts',
  MEDIA: 'media',
  TAGS: 'tags',
  CATEGORIES: 'categories',
  COMMENTS: 'comments',
}
// post接口返回字段约束
export const _fields = {
  [TYPES.POSTS]: [
    'author',
    'categories',
    'date',
    'excerpt',
    'featured_media',
    'id',
    'tags',
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
    'link',
    'name',
    'taxonomy',
    'parent'
  ],
  [TYPES.COMMENTS]: [
    'author',
    'author_name',
    'id',
    'date',
    'link',
    'content',
    'post'
  ]
}