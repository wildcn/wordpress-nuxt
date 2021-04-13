<template>
  <div class="page-category">
    <div>
      <div class="main">
        <h2 v-if="categories[0]"><i class="icon-column"></i>{{categories[0].name}}</h2>
        <post-list :list="posts"></post-list>
      </div>
    </div>
  </div>
</template>

<script>
  import PostList from '../../components/PostList'
  import { CategoryCollection, PostCollection } from '../../resource'

  const categoryCollection = CategoryCollection.getInstance()
  const postCollection = PostCollection.getInstance()
  export default {
    name: 'category',
    mounted() {
      categoryCollection.list = this.categoryCollection.list
      categoryCollection._paging = this.categoryCollection._paging
      categoryCollection.fetchMap()
    },
    async asyncData(ctx) {
      try {
        // const id = +this.$route.params.id;
        const id = +ctx.params.id
        var categories
        try {
          categories = await categoryCollection.fetchCategoriesByRootIds(id)
        } catch (err) {
          categories = []
        }

        const ids = categories.map((item) => item.id)
        const posts = await postCollection.fetchList({
          categories: ids,
          limit: 20,
        })

        // this.posts = posts;
        // this.categories = categories;
        // this.categoryCollection = categoryCollection;

        return {
          posts,
          categories,
          categoryCollection,
        }
      } catch (err) {}
    },
    components: {
      PostList,
    },
    data() {
      return {
        posts: [],
        categories: [],
      }
    },
    
  }
</script>

<style lang="scss" scoped>
  @import '~/styles/var.scss';
  .page-category {
    margin: 20px auto;
    width: 960px;
    min-height: 600px;
    .main h2{
      text-align: left;
      margin-bottom: 20px;
      border-bottom: 1px solid #fff;
      padding-bottom: 10px;
      color:#555;
      i{
        font-size: 1em;
        padding-right: 10px;
        color: $primary;
      }
    }
  }
</style>