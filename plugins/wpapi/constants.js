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
    'novel_category',
    'date',
    'excerpt',
    'featured_media',
    'id',
    'link',
    'meta',
    'tags',
    'novel_tag',
    'title',
    'type'
  ],
  [TYPES.MEDIA]: [
    'author',
    'id',
    'source_url',
    'post',
    'mime_type',
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
    'taxonomy'
  ],
  [TYPES.COMMENTS]: [
    'author',
    'author_name',
    'id',
    'date',
    'link',
    'content'
  ]
}