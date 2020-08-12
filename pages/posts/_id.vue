<template>
  <div id="article">
    <page-tool class="left-tool" :date="postModel.date"></page-tool>
    <transition name="fade">
      <div class="header-fixed" v-if="fixedHeader">
        <div class="logo">
          <a href="/">
            <Logo></Logo>
          </a>
        </div>
        <div class="content">
          <h1>{{postModel.title.rendered}}</h1>
        </div>
      </div>
    </transition>
    <div id="content">
      <div class="main">
        <h1>{{postModel.title.rendered}}</h1>
        <div class="info">
          <!-- <time :datetime="time" class="date">{{time}}</time> -->
        </div>
        <div class="txt" v-highlight v-html="postModel.content.rendered"></div>
      </div>
      <div class="secondary">
        <div class="item" v-show="validRecommand.length">
          <div class="title">推荐阅读</div>
          <div class="list">
            <li v-for="(item,index) in validRecommand" :key="index">
              <a :href="`/posts/${item.id}`">
                <img
                  :src="item.featuredMediaModel.source_url"
                  v-show="item.featuredMediaModel && item.featuredMediaModel.source_url"
                />
                <p>{{item.title.rendered}}</p>
                <p class="excerpt" v-html="item.excerpt.rendered"></p>
              </a>
              <div class="info"></div>
            </li>
          </div>
        </div>
      </div>
    </div>
    <div class="common">
      <div class="comment-list">
        <div class="menu">
          <div class="h1">
            <span class="title">全部评论</span>
            <span class="total">{{postModel.commentsCollection.length}}</span>
          </div>
        </div>
        <div class="list">
          <ul>
            <li v-for="(item,index) in postModel.commentsCollection" :key="index">
              <div class="meta">
                <div class="name">{{item.author_name}}</div>
                <div class="time">{{item.date}}</div>
              </div>
              <div class="content" v-html="item.content.rendered"></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <Comment v-model="commentContent" @update="updateComment" :PostModel="postModel"></Comment>
  </div>
</template>

<script>
  import { PostModel, CategoryCollection, CommentModel } from '../../resource'
  import PageTool from '../../components/PageTool'
  import wp from '../../plugins/wpapi'
  import Logo from '../../components/Logo'
  import Comment from '../../components/Comment'

  const categoryCollection = CategoryCollection.getInstance()

  export default {
    components: {
      PageTool,
      Logo,
      Comment,
    },
    async asyncData(ctx) {
      const id = +ctx.params.id
      const postModel = await new PostModel(id)
      const content = await postModel.fetchContent()

      await categoryCollection.fetchList()
      // 获取推荐列表
      const sticky = await wp.posts().sticky(true).perPage(5)
      const recommand = await Promise.complete(
        sticky.map(async (item) => await new PostModel(item)),
        'posts/id asyncData'
      )

      return {
        categoryCollection,
        postModel,
        recommand,
        id,
      }
    },
    data() {
      return {
        postModel: {},
        recommand: [],
        fixedHeader: false,
        rewardDialog: false,
        commentContent: '',
      }
    },
    mounted() {
      window.addEventListener('scroll', this.changeScroll)
      categoryCollection.list = this.categoryCollection.list
      categoryCollection._paging = this.categoryCollection._paging
      categoryCollection.fetchMap()
    },
    computed: {
      time() {
        const time = new Date(this.postModel.date)
        var year = time.getFullYear()
        var month = time.getMonth() - 1
        var day = time.getDay()
        var hour = time.getHours()
        var minute = time.getMinutes()
        var second = time.getSeconds()
        return {
          year,
          md: `${month}/${day}`,
          time: `${hour}:${minute}`,
        }
      },
      validRecommand() {
        return this.recommand.filter((item) => item.id !== this.id)
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
      updateComment(param) {
        param.post = this.postModel.id
        CommentModel.createComment(param)
          .then((data) => {
            this.$message.success('评论成功！')
            this.commentContent = ''
          })
          .catch((err) => {
            if (err.message) {
              this.$message.error(err.message)
              this.commentContent = ''
            }
          })
      },
    },
  }
</script>

<style lang="scss">
  @import '~/styles/var.scss';
  #article {
    background-color: #f9f9f9;
    display: block;
    overflow: hidden;
  }

  .left-tool {
    position: fixed;
    left: 50%;
    margin-left: -580px;
    top: 90px;
    width: 80px;
    text-align: center;
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
  .common{
    width: 960px;
    margin: 0 auto;
  }
  .comment-list {
    width: 650px;
    background-color: #fff;
    text-align: left;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 5px;
    margin-bottom: 30px;
    .menu {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-left: 12px;
      border-left: 4px solid #ec7259;
      font-size: 18px;
      font-weight: 500;
      height: 20px;
      line-height: 20px;
      .title {
        font-size: 18px;
        margin-right: 10px;
      }
    }
    ul li {
      border-bottom: 1px solid #f9f9f9;
      margin-bottom: 20px;
      padding-bottom: 20px;
      &:last-child{
        margin-bottom: 0;
        padding-bottom: 0;
        border:none;
      }
      .name {
        font-size: 15px;
        font-weight: 500;
      }
      .time {
        font-size: 12px;
        color: #969696;
      }
      .content {
        margin-top: 10px;
        font-size: 16px;
        line-height: 1.5;
        word-break: break-word;
      }
    }
  }
</style>