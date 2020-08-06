<template>
  <div id="article">
    <div class="left-tool">
      <div id="date">
        <div class="year">
          <span>{{time.year}}</span>
        </div>
        <div class="md">{{time.md}}</div>
        <div class="time">{{time.time}}</div>
      </div>
    </div>
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
              <a :href="item.link">
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
  import wp from '../../plugins/wpapi'
  export default {
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
      }
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
  }
</script>

<style lang="scss">
  @import '~/styles/var.scss';
  #article {
    background-color: #f9f9f9;
    display: block;
    overflow: hidden;
  }
  #content {
    margin: 30px auto;
    width: 960px;
    overflow: hidden;
    display: flex;
    .info {
      font-size: 12px;
      color: #999;
      margin-bottom: 20px;
    }
    .main {
      background-color: #fff;
      width: 650px;
      padding: 20px;
      border-radius: 5px;
      box-sizing: border-box;
      text-align-last: left;
      h2,
      h3 {
        margin-top: 20px;
      }
      img,
      figure,
      image {
        text-align: center;
        display: inherit;
        margin: 0 auto;
      }
      blockquote {
        padding: 20px 0 20px 20px;
        margin: 20px 0;
        background-color: #ebebeb;
        border-left: 2px solid $danger;
        p {
          margin-bottom: 0;
        }
      }
      p code {
        background-color: #dcd7ca;
        background: rgba(0, 0, 0, 0.075);
        border-radius: 0.2rem;
        font-family: monospace;
        font-size: 0.9em;
        padding: 0.4rem 0.6rem;
      }
      li {
        line-height: 1.8em;
        position: relative;
        padding-left: 1em;
        &:before {
          content: '';
          width: 4px;
          height: 2px;
          background-color: $primary;
          position: absolute;
          left: 2px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      pre code {
        font-family: source;
        margin: 20px 0;
        padding: 10px;
        font-size: 14px;
        white-space: pre-wrap;
        border-radius: 5px;
      }
      strong,
      h2,
      h1,
      h3,
      p {
        margin-bottom: 20px;
      }
      strong {
        display: block;
      }
      p {
        margin-bottom: 20px;
        word-break: break-word;
        margin-top: 0;
        font-weight: 400;
        line-height: 1.8;
        font-size: 16px;
        color: #404040;
      }
    }
    .secondary {
      flex: 1;
      margin-left: 20px;
      .item {
        background-color: #fff;
        border-radius: 5px;
        margin-bottom: 20px;
        padding: 10px;
        .title {
          font-size: 16px;
          padding-left: 6px;
          border-left: 4px solid #ec7259;
          margin-bottom: 16px;
          text-align-last: left;
        }
        .list {
          text-align: left;
          img {
            width: 100%;
            border: 1px solid #f9f9f9;
            border-width: 1px;
          }
          li {
            margin-bottom: 20px;
          }
          li,
          a {
            font-size: 16px;
            color: #2d2d2d;
            line-height: 1.6em;
            .excerpt {
              padding-top: 5px;
              font-size: 12px;
              color: #2d2d2d;
              line-height: 1.4em;
            }
          }
          a:hover {
            color: $primary;
          }
        }
      }
    }
  }
  .left-tool {
    position: fixed;
    left: 50%;
    margin-left: -580px;
    top: 90px;
    font-family: monospace;
    width: 80px;
    text-align: center;
    .year {
      position: relative;
      color: #777;
      font-size: 18px;
      span {
        display: inline-block;
        background: #f9f9f9;
        padding: 0 5px;
      }
      &:after {
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        background: #777;
        position: absolute;
        top: 50%;
        left: 0;
        z-index: -1;
      }
    }
    .md {
      font-size: 40px;
      color: #777;
    }
    .time {
      font-size: 14px;
      color: #999;
    }
  }
</style>