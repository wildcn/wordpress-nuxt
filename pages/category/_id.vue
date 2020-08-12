<template>
  <div class="page-category">
    <div class="column" v-for="(val,key,index) in postsByCategories" :key="index">
      <div
        v-if="categoriesMap[key] && categoriesMap[key].name"
        class="title"
      >{{categoriesMap[key].name}}</div>
      <ul>
        <li v-for="(item,idx) in val" :key="idx">
          <a :href="`/posts/${item.id}`">{{item.title.rendered}}</a>
          <p class="info" v-html="item.excerpt.rendered"></p>
          <el-tag
            class="tag"
            size="mini"
            v-for="(tag,itag) in item.tagsCollection"
            :key="itag"
            v-show="item.tagsCollection.length"
          >{{tag.name}}</el-tag>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import wp from '../../plugins/wpapi'
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
          categories = await categoryCollection.fetchCategoriesByRootId(id)
        } catch (err) {
          console.log('Data -> err', err)
          categories = []
        }

        const ids = categories.map((item) => item.id)
        const posts = await postCollection.fetchList({ categories: ids })

        return {
          posts,
          categories,
        }
      } catch (err) {
        console.log('Data -> err', err)
      }
    },
    data() {
      return {
        posts: [],
        categories: [],
      }
    },
    mounted () {
      // categoryCollection.list = this.categories.list;
      // categoryCollection.fetchMap();
    },
    computed: {
      categoriesMap() {
        return this.categories.reduce(
          (pre, next) => Object.assign(pre, { [next.id]: next }),
          {}
        )
      },
      postsByCategories() {
        return this.posts.reduce((pre, next) => {
          next.categories.forEach((categoryId) => {
            pre[categoryId] = pre[categoryId] || []
            pre[categoryId].push(next)
          })
          return pre
        }, {})
      },
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