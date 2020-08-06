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
  import {
    PostModel,
    TagCollection,
    CategoryCollection,
    CommentCollection,
  } from '../resource'

  const tagCollection = TagCollection.getInstance()
  const categoryCollection = CategoryCollection.getInstance()
  const commentCollection = CommentCollection.getInstance()

  export default {
    async mounted(ctx) {
      try {
        const param = {
          per_page: 10,
          page: 1,
        }
        // 获取栏目列表
        const categoryMapList = await categoryCollection.fetchMap()
        // 获取标签
        const tagMapList = await tagCollection.fetchMap()
        // 获取评论
        const commentMapList = await commentCollection.fetchMap()
        // 获取文章列表
        const posts = await Promise.complete(
          [].concat(await $wp.posts()).map(async (id) => await new PostModel(id))
        )
        // 获取标签
        this.posts = posts
        this.categoryMapList = categoryMapList
        this.tagMapList = tagMapList
        this.commentMapList = commentMapList
        // this.rootCategories = rootCategories;

        return {
          posts,
          categoryMapList,
          tagMapList,
          commentMapList,
          // rootCategories
        }
      } catch (err) {
        console.log('Data -> err', err)
        return {
          posts: [],
          tagMapList: [],
          categoryMapList: [],
          commentMapList: [],
          rootCategories: [],
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
    }
    .secondary {
      width: 300px;
    }
  }
</style>
