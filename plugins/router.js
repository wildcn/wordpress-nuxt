import { PostCollection, TagCollection, CategoryCollection, MediaCollection, CommentCollection } from '../resource';

const postCollection = PostCollection.getInstance();
const tagCollection = TagCollection.getInstance();
const categoryCollection = CategoryCollection.getInstance();
const mediaCollection = MediaCollection.getInstance();
const commentCollection = CommentCollection.getInstance();


const initCollection = () => {
  postCollection.param.offset = 0;
  tagCollection.param.offset = 0;
  categoryCollection.param.offset = 0;
  mediaCollection.param.offset = 0;
  commentCollection.param.offset = 0;
}

export default ({ app }) => {
  app.router.beforeEach((to, from,next) => {
    initCollection();
    next();
  })
}

