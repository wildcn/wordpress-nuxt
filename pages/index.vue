<template>
  <div class="container">
    <dlq-header></dlq-header>
    <div class="content">
      <post-list v-model="posts" class="main"></post-list>
      <div class="secondary">
        <card></card>
      </div>
    </div>
  </div>
</template>

<script>
  import PostList from '../components/PostList'
  import Header from '../components/Header'
  import Card from '../components/Card'
  import $wp from '~/plugins/wpapi';
  import { PostModel } from '~/resource'


  export default {
    async asyncData(ctx) {
      try {
        const posts = await $wp.posts()
        const novel = await $wp.novel()
        const result = [].concat(posts, novel).map((post) => new PostModel(post))
        return {
          posts: result,
        }
      } catch (err) {
        console.log("Data -> err", err)
        return {
          posts: [],
        }
      }
    },
    components: {
      PostList,
      Card,
      'dlq-header': Header,
    },
    methods: {
      async fetchPosts(ctx) {
        try {
          const posts = await ctx.$wp.posts()
          const novel = await ctx.$wp.novel()
          const result = []
            .concat(posts, novel)
            .map((post) => new PostModel(post))
          return {
            posts: result,
          }
        } catch (err) {
          return {
            posts: [],
          }
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .container {
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 60px;
  }
  .content {
    margin: 960px;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
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
