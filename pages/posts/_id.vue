<template>
  <div>
    <page-tool :date="postModel.date"></page-tool>
    <div id="article">
      <transition name="fade">
        <div class="header-fixed" v-if="fixedHeader">
          <div class="logo">
            <a href="/">
              <Logo></Logo>
            </a>
          </div>
          <div class="content">
            <h1>{{postModel.title}}</h1>
          </div>
        </div>
      </transition>
      <div id="content" :class="{full:contentExtend}">
        <div class="main">
          <h1>{{postModel.title}}</h1>
          <div class="excerpt" v-show="postModel.excerpt">
            <p>{{postModel.excerpt}}</p>
          </div>
          <div
            class="icon-extend"
            :class="{transform:contentExtend}"
            @click="contentExtend = !contentExtend"
          ></div>
          <div class="info"></div>
          <!-- <div
          class="featured_media"
          v-show="postModel.featuredMediaModel && postModel.featuredMediaModel.source_url"
        >
          <img :src="postModel.featuredMediaModel.source_url" />
          </div>-->
          <div class="txt" v-highlight v-html="formatContent"></div>
          <CommentList
            name="comment"
            @reply="reply"
            class="common"
            v-if="commentList.length"
            :commentList="commentList"
            :postModel="postModel"
          ></CommentList>
        </div>
        <div class="secondary">
          <div class="item plain" v-show="column.length">
            <div class="title">相关阅读</div>
            <div class="list">
              <li v-for="(item,index) in column" :key="index">
                <a :href="`/posts/${item.id}`">
                  <p>{{item.title}}</p>
                </a>
                <div class="info"></div>
              </li>
            </div>
          </div>
          <div class="item" v-show="validRecommand.length">
            <div class="title">推荐阅读</div>
            <div class="list">
              <li v-for="(item,index) in validRecommand" :key="index">
                <a :href="`/posts/${item.id}`">
                  <p>{{item.title}}</p>
                </a>
                <p class="des">
                  <el-tag
                    type="info"
                    size="mini"
                    class="category"
                    v-for="category in item.categories"
                    :key="category.id"
                  >{{category.name}}</el-tag>
                  <span class="excerpt">
                    <p>{{item.excerpt}}</p>
                  </span>
                </p>

                <div class="info"></div>
              </li>
            </div>
          </div>
          <!-- <div class="item" v-if="mediaCollection.list && mediaCollection.list.length">
            <MediaWall :collection="mediaCollection"></MediaWall>
          </div> -->
        </div>
      </div>
      <CommentFixed
        v-if="postModel.commentsCollection"
        :commentList="postModel.commentsCollection"
        :reply="replyItem"
        @cancel="replyItem = {}"
        v-model="commentContent"
        @update="updateComment"
        :postModel="postModel"
      ></CommentFixed>
    </div>
  </div>
</template>

<script>
  import {
    PostModel,
    PostCollection,
    CategoryCollection,
    CommentModel,
    MediaCollection,
  } from '../../resource'
  import PageTool from '../../components/PageTool'
  import wpr from '../../plugins/wp-xhr'
  import Logo from '../../components/Logo'
  import CommentFixed from '../../components/CommentFixed'
  import CommentList from '../../components/CommentList'
  import MediaWall from '../../components/MediaWall'

  const categoryCollection = CategoryCollection.getInstance()
  const mediaCollection = MediaCollection.getInstance()
  const postCollection = PostCollection.getInstance()

  let contentExtend = false
  if (process.client) {
    contentExtend = localStorage.getItem('contentExtend') === 'true'
  }
  export default {
    layout: 'post',
    components: {
      PageTool,
      Logo,
      CommentFixed,
      CommentList,
      MediaWall,
    },
    mounted() {
      window.addEventListener('scroll', this.changeScroll)
      categoryCollection.list = this.categoryCollection.list
      categoryCollection._paging = this.categoryCollection._paging
      categoryCollection.fetchMap()

    },
    async asyncData(ctx) {
      const id = +ctx.params.id
      // const id = +this.$route.params.id
      const postModel = await new PostModel(id)
      await postModel.fetchContent();
      await postModel.fetchComments();
      
      await categoryCollection.fetchList()
      // 获取相关栏目列表
      const column = await wpr.posts.read({categories:postModel.categories.map((item) => item.id).join(',')})
      // 获取推荐列表
      // const sticky = await postCollection.fetchStickyPosts({skip:id});
      
      // const recommand = sticky.rows;
      const recommand = [];

      // this.categoryCollection = categoryCollection
      // this.postModel = postModel
      // this.recommand = recommand
      // this.id = id
      // this.column = column.rows

      return {
        categoryCollection,
        postModel,
        recommand,
        id,
        column:column.rows,
      }
    },
    watch: {
      contentExtend(val) {
        localStorage.setItem('contentExtend', val)
        this.$notify({
          message: '您的布局修改已被记录!',
          type: 'success',
          dangerouslyUseHTMLString: true,
          duration: 1500,
        })
      },
    },
    head() {
      const des = this.postModel.excerpt
      const description = `${this.postModel.title} ${des} ——合生——杜连强的博客`
      return {
        title: this.postModel.title + '——合生——杜连强的博客',
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
        postModel: {},
        recommand: [],
        fixedHeader: false,
        rewardDialog: false,
        column: [],
        commentContent: '',
        replyItem: {},
        contentExtend,
      }
    },
    
    computed: {
      validRecommand() {
        return this.recommand.filter((item) => item.id !== this.id)
      },
      h2List() {
        if (this.postModel.content && this.postModel.content) {
          const content = this.postModel.content
          var idx = 1
          content.replace(/<h2>/g, function (match) {
            return '<h2 name="h2-' + idx + '">'
          })
          const h2 = content.match(/<h2>(.+)<\/h2>/g)
          return h2
        }
        return []
      },
      formatContent() {
        if (this.postModel.content) {
          var content = this.postModel.content;
          return content;
        }
        return ''
      },
      commentList() {
        if (Array.isArray(this.postModel.commentsCollection) && this.postModel.commentsCollection.length === 0) {
          return []
        }
        const list = this.postModel.commentsCollection.map((item) => {
          delete item.children
          return item
        })
        const listIds = list.reduce(
          (pre, next) => Object.assign(pre, { [next.id]: next }),
          {}
        )
        list.forEach((item) => {
          if (listIds[item.parent]) {
            listIds[item.parent].children = listIds[item.parent].children || []
            listIds[item.parent].children.push(item)
            delete listIds[item.id]
          }
        })
        return Object.values(listIds)
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
        if (this.replyItem.id) {
          param.parent = this.replyItem.id
        }
        CommentModel.createComment(param)
          .then((data) => {
            this.$message.success('评论成功！')
            this.postModel.fetchComments();
            this.replyItem = {}
            this.commentContent = ''
          })
          .catch((err) => {
            if (err.message) {
              this.$message.error(err.message)
              this.replyItem = {}
              this.commentContent = ''
            }
          })
      },
      reply(item) {
        this.replyItem = item
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