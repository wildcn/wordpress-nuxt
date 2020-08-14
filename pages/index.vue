<template>
  <div class="content">
    <post-list v-model="postCollection" class="main"></post-list>
    <div class="secondary">
      <card></card>
    </div>
  </div>
</template>

<script>
  import PostList from '../components/PostList'
  import Card from '../components/Card'
  import $wp from '~/plugins/wpapi'
  import { PostCollection, CategoryCollection } from '../resource'

  const postCollection = PostCollection.getInstance()
  const categoryCollection = CategoryCollection.getInstance()

  export default {
    mounted() {
      this.initCollection();
    },
    async asyncData(ctx) {
      try {
        const param = {
          per_page: 10,
          page: 1,
        }
        // 获取文章列表
        const posts = await postCollection.fetchList()
        console.log("mounted -> posts", posts)
        // 获取标签
        // this.posts = posts;
        // this.postCollection = postCollection;
        // this.categoryCollection = categoryCollection;
        // this.initCollection();
        return {
          posts,
          categoryCollection,
          postCollection,
          // rootCategories
        }
      } catch (err) {
        console.log('Data -> err', err)
        return {
          postCollection,
        }
      }
    },
    
    methods: {
      initCollection() {
        categoryCollection.list = this.categoryCollection.list
        categoryCollection._paging = this.categoryCollection._paging;
        categoryCollection.fetchMap()

        postCollection.list = this.postCollection.list
        postCollection._paging = this.postCollection._paging;
        postCollection.fetchMap()
      },
    },
    data() {
      return {
        posts: [],
        postCollection,
        categoryCollection,
        tagMapList: [],
        categoryMapList: [],
        commentMapList: [],
      }
    },
    components: {
      PostList,
      Card,
    },
  }
</script>

<style lang="scss" scoped>
  .content {
    margin: 0 auto;
    overflow: hidden;
    display: flex;
    width: 960px;
    .main,
    .secondary {
      display: inline-block;
    }
    .main {
      width: 650px;
      flex: 1;
      margin-top: 20px;
      // background-color: #fff;
    }
    .secondary {
      width: 300px;
    }
  }
</style>
