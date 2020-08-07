<template>
  <div class="content">
    <post-list v-model="posts" class="main"></post-list>
    
    <div class="secondary">
      <card></card>
    </div>
  </div>
</template>

<script>
  import PostList from '../components/PostList'
  import Card from '../components/Card'
  import $wp from '~/plugins/wpapi'
  import { PostCollection } from '../resource'

  const postCollection = PostCollection.getInstance()

  export default {
    async asyncData(ctx) {
      try {
        const param = {
          per_page: 10,
          page: 1,
        }
        // 获取文章列表
        const posts = await postCollection.fetchList()
        // 获取标签
        // this.posts = posts
        // this.param = param

        return {
          posts,
          param,
          // rootCategories
        }
      } catch (err) {
        console.log('Data -> err', err)
        return {
          posts: [],
        }
      }
    },
    data() {
      return {
        posts: [],
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
    }
    .secondary {
      width: 300px;
    }
  }
</style>
