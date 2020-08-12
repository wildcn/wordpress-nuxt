import { PostCollection, TagCollection, CategoryCollection, MediaCollection, CommentCollection } from '../resource';

const postCollection = PostCollection.getInstance();
const tagCollection = TagCollection.getInstance();
const categoryCollection = CategoryCollection.getInstance();
const mediaCollection = MediaCollection.getInstance();
const commentCollection = CommentCollection.getInstance();


const initCollection = () => {
  postCollection.param.page = 1;
  tagCollection.param.page = 1;
  categoryCollection.param.page = 1;
  mediaCollection.param.page = 1;
  commentCollection.param.page = 1;
}

export default ({ app }) => {
  app.router.beforeEach((to, from,next) => {
    initCollection();
    next();
  })
}

