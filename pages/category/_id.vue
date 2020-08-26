<template>
  <div class="page-category">
    <div>
      <div class="main">
        <post-list :list="posts"></post-list>
      </div>
    </div>
  </div>
</template>

<script>
  import wp from '../../plugins/wpapi'
  import PostList from '../../components/PostList';
  import { CategoryCollection, PostCollection } from '../../resource'

  const categoryCollection = CategoryCollection.getInstance()
  const postCollection = PostCollection.getInstance()
  export default {
    name: 'category',
    async asyncData(ctx) {
      try {
        const id = +ctx.params.id
        var categories
        try {
          categories = await categoryCollection.fetchCategoriesByRootIds(id)
        } catch (err) {
          categories = []
        }

        const ids = categories.map((item) => item.id)
        const posts = await postCollection.fetchList({ categories: ids,per_page:20 })

        return {
          posts,
          categories,
          categoryCollection
        }
      } catch (err) {
      }
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
    mounted () {
      categoryCollection.list = this.categoryCollection.list;
      categoryCollection._paging = this.categoryCollection._paging;
      categoryCollection.fetchMap();
    },
  }
</script>

<style lang="scss" scoped>
  @import '~/styles/var.scss';
  .page-category {
    margin: 20px auto;
    width: 960px;
    min-height: 600px;

    .column {
      width: 460px;
      float: left;
      background-color: #fff;
      border-radius: 5px;
      text-align: left;
      padding: 10px 20px;
      box-sizing: border-box;
      margin-bottom: 20px;
      &:nth-child(n) {
        margin-right: 10px;
      }
      &:nth-child(2n) {
        margin-left: 10px;
      }
      .title {
        font-size: 20px;
        height: 20px;
        line-height: 20px;
        margin: 10px 0;
        border-bottom: 1px solid #f9f9f9;
        padding-bottom: 10px;
      }
      li {
        margin-bottom: 20px;
      }
      .info {
        color: #999;
        font-size: 12px;
        margin-top: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .tag {
        margin-right: 5px;
      }
      li a {
        line-height: 24px;
        height: 24px;
        color: #333;
        &:hover {
          color: $primary;
        }
      }
    }
  }
</style>