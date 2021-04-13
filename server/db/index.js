
const {
  postsAction,
  categoriesAction,
  commentsAction,
  tagsAction,
  optionsAction,
  term_relationshipsAction,
  mediaAction
} = require('./actions');


const { BASE_URL, TYPES } = require('../../constants/api');
// @TODO 接口区分permision


const resource = {
  [`${BASE_URL}${TYPES.POSTS}`]: postsAction,
  [`${BASE_URL}${TYPES.CATEGORIES}`]: categoriesAction,
  [`${BASE_URL}${TYPES.COMMENTS}`]: commentsAction,
  [`${BASE_URL}${TYPES.TAGS}`]: tagsAction,
  [`${BASE_URL}${TYPES.OPTIONS}`]: optionsAction,
  [`${BASE_URL}${TYPES.MEDIA}`]:mediaAction,
  [`${BASE_URL}${TYPES.TERM_RELATIONSHIPS}`]: term_relationshipsAction,
}


module.exports['resource'] = resource;