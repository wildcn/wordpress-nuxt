<template>
  <div class="content">
    <div class="main">
      <post-list :list="posts"></post-list>
      <el-button
        size="medium"
        plain
        :disabled="noData"
        v-show="posts.length"
        class="more"
        @click="more"
      >{{noData?'暂无更多数据':'加载更多'}}</el-button>
    </div>

    <div class="secondary">
      <card></card>
      <Github></Github>
      <List :list="literaturePosts"></List>
    </div>
  </div>
</template>

<script>
  import PostList from '../components/PostList'
  import List from '../components/List';
  import Github from '../components/Github';
  import Card from '../components/Card'
  import wp from '~/plugins/wpapi'
  import { PostCollection, CategoryCollection,CommentCollection } from '../resource'
  import { CATEGORY_NAMES, CATEGORIES } from '../constants/categories'

  const postCollection = PostCollection.getInstance()
  const categoryCollection = CategoryCollection.getInstance()
  const commentCollection = CommentCollection.getInstance();

  const mainCategories = [CATEGORIES.FRONT_END, CATEGORIES.FULL_STACK]
  const literatureCategories = [CATEGORIES.LITERATURE, CATEGORIES.DIARY]

  export default {
    async mounted() {
      this.initCollection()
    },
    async asyncData(ctx) {
      let posts = []
      let param = {}
      try {
        const categoriesFe = await categoryCollection.fetchCategoriesByRootIds(
          mainCategories
        )
        const categories = categoriesFe.map((item) => item.id)
        param = { categories }
        posts = await postCollection.fetchList(param)

        const categoriesLiterature = await categoryCollection.fetchCategoriesByRootIds(
          literatureCategories
        )
        const literaturePosts = await wp.posts().categories(categoriesLiterature.map((item) => item.id))
        // this.param = param;
        // this.posts = posts;

        return {
          param,
          posts,
          literaturePosts,
          categoryCollection,
          postCollection,
          commentCollection
        }
      } catch (err) {
        return {
          param,
          posts,
          categoryCollection,
          postCollection,
          commentCollection
        }
      }
    },
    data() {
      return {
        param: {},
        posts: [],
        literaturePosts: [],
        categoryCollection,
        commentCollection,
        postCollection,
        noData: false,
        scrollTop: 0,
      }
    },
    components: {
      PostList,
      Card,
      List,
      Github
    },
    methods: {
      async initCollection() {
        categoryCollection.list = this.categoryCollection.list
        categoryCollection._paging = this.categoryCollection._paging
        categoryCollection.fetchMap()

        postCollection.list = this.postCollection.list
        postCollection._paging = this.postCollection._paging
        postCollection.fetchMap()

        commentCollection.list = this.commentCollection.list
        commentCollection._paging = this.commentCollection._paging
        commentCollection.fetchMap()
      },
      more() {
        this.scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop
        postCollection
          .more(this.param)
          .then((data) => {
            this.posts = [].concat(this.posts, data)
            this.$nextTick(function () {
              window.scrollTo(0, this.scrollTop)
            })
          })
          .catch((err) => {
            this.noData = true
          })
      },
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
  .more {
    width: 100%;
    display: block;
    cursor: pointer;
    margin-bottom: 30px;
  }
</style>
