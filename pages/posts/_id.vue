<template>
  <div id="article">
    <page-tool class="left-tool" :date="postModel.date"></page-tool>
    <transition name="fade">
      <div class="header-fixed" v-if="fixedHeader">
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
  </div>
</template>

<script>
  import { PostModel } from '../../resource'
  import PageTool from '../../components/PageTool';
  import wp from '../../plugins/wpapi'
  export default {
    components: {
      PageTool,
    },
    async asyncData(ctx) {
      const id = +ctx.params.id
      const postModel = await new PostModel(id)
      const content = await postModel.fetchContent()
      // 获取推荐列表
      const sticky = await wp.posts().sticky(true).perPage(5)
      const recommand = await Promise.complete(
        sticky.map(async (item) => await new PostModel(item))
      )

      return {
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
      }
    },
    mounted() {
      window.addEventListener('scroll', this.changeScroll)
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
</style>