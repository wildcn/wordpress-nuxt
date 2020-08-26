<template>
  <div id="tags">
    <transition name="fade">
      <div class="header-fixed" v-if="fixedHeader">
        <div class="logo">
          <a href="/">
            <Logo></Logo>
          </a>
        </div>
        <div class="content">{{name}}</div>
      </div>
    </transition>
    <div id="content" :class="{full:contentExtend}">
      <div class="tags-main">
        <h1>标签：{{name}}</h1>
        <post-list :list="posts"></post-list>
      </div>
      <div class="secondary">
        <div class="item" v-show="validRecommand.length">
          <div class="title">推荐阅读</div>
          <div class="list">
            <li v-for="(item,index) in validRecommand" :key="index">
              <a :href="`/posts/${item.id}`">
                <p>{{item.title.rendered}}</p>
              </a>
              <p class="des">
                <el-tag
                  type="info"
                  size="mini"
                  class="category"
                  v-for="category in item.categoriesCollection"
                  :key="category.id"
                >{{category.name}}</el-tag>
                <span class="excerpt" v-html="item.excerpt.rendered"></span>
              </p>

              <div class="info"></div>
            </li>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    PostModel,
    PostCollection,
    CategoryCollection,
    CommentModel,
    TagModel,
  } from '../../resource'
  import PostList from '../../components/PostList'
  import wp from '../../plugins/wpapi'
  import Logo from '../../components/Logo'
  import CommentFixed from '../../components/CommentFixed'
  import CommentList from '../../components/CommentList'

  const categoryCollection = CategoryCollection.getInstance()
  const postCollection = PostCollection.getInstance()

  let contentExtend = false
  if (process.client) {
    contentExtend = localStorage.getItem('contentExtend') === 'true'
  }
  export default {
    layout: 'post',
    components: {
      Logo,
      PostList,
    },
    async asyncData(ctx) {
      const id = +ctx.params.id
      // const id = +this.$route.params.id
      const tagModel = await new TagModel(id)

      const posts = await postCollection.fetchList({ tags: id,per_page:20 })
      await categoryCollection.fetchList()

      // 获取推荐列表
      const sticky = await wp
        .posts()
        .sticky(true)
        .perPage(5)
        .order('desc')
        .orderby('date')
      const recommand = await Promise.complete(
        sticky.map(async (item) => await new PostModel(item)),
        'posts/id asyncData'
      )

      return {
        categoryCollection,
        recommand,
        tagModel,
        posts,
        id,
      }
    },
    head() {
      const description = `${this.name}/标签 ——合生——杜连强的博客`
      return {
        title: this.name + '——标签——合生——杜连强的博客',
        description: description,
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: description,
          },
        ],
      }
    },
    data() {
      return {
        tagModel: {},
        postModel: {},
        posts: [],
        recommand: [],
        fixedHeader: false,
        rewardDialog: false,
        commentContent: '',
        replyItem: {},
        contentExtend,
      }
    },
    mounted() {
      window.addEventListener('scroll', this.changeScroll)
      categoryCollection.list = this.categoryCollection.list
      categoryCollection._paging = this.categoryCollection._paging
      categoryCollection.fetchMap()
    },
    computed: {
      validRecommand() {
        return this.recommand.filter((item) => item.id !== this.id)
      },
      name(){
        return this.tagModel && this.tagModel.name || '标签';
      },
    },
    methods: {
      changeScroll() {
        // 获取高度
        var scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop
        // 判断筛选条件是否显示
        this.fixedHeader = scrollTop > 200 ? true : false
      },
    },
  }
</script>

<style lang="scss">
  @import '~/styles/var.scss';
  #tags {
    text-align: left;
    .tags-main {
      width: 650px;
      flex: none;
    }
    h1 {
      margin-bottom: 30px;
    }
  }
  .header-fixed {
    position: fixed;
    right: 0;
    left: 0;
    top: 0;
    margin-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;
    height: 60px;
    line-height: 60px;
    background: #373938;
    z-index: 999;
    .content {
      width: 960px;
      margin: 0 auto;
      text-align: left;
    }
    h1 {
      font-weight: normal;
      font-size: 24px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    * {
      color: #fff;
    }
  }
  .logo {
    display: inline-block;
    height: 50px;
    position: absolute;
    top: 5px;
    left: 15px;
    a {
      display: block;
      height: 100%;
    }
    img {
      height: 100%;
      width: auto;
      &:hover {
        fill: $primary;
      }
    }
  }
</style>