<template>
  <div class="post-list">
    <ul>
      <li v-for="(item,index) in posts" :key="index">
        <div
          class="wrap-media"
          v-show="item.featuredMediaModel.id"
          :style="{'background-image':'url('+item.featuredMediaModel.source_url+')'}"
        ></div>
        <div class="content">
          <a :href="`/posts/${item.id}`" class="title" v-html="item.title.rendered"></a>
          <div class="abstract" v-html="item.excerpt.rendered"></div>
          <div class="media">
            <span class="tags category" v-show="item.categoriesCollection.length">
              <i class="iconfont icon-category"></i>
              <a
                :href="item.link"
                v-for="(item,idx) in item.categoriesCollection"
                :key="idx"
              >{{item.name}}</a>
            </span>
            <span class="tags" v-show="item.tagsCollection.length">
              <i class="iconfont icon-tag"></i>
              <a
                :href="item.link"
                v-for="(item,idx) in item.tagsCollection"
                :key="idx"
              >{{item.name}}</a>
            </span>
            <span class="comment" v-show="item.commentsCollection.length">
              <i class="iconfont icon-comment"></i>
              {{item.commentsCollection.length}}
            </span>
          </div>
        </div>
      </li>
    </ul>
    <el-button
      size="medium"
      plain
      :disabled="noData"
      v-show="posts.length"
      class="more"
      @click="more"
    >{{noData?'暂无更多数据':'加载更多'}}</el-button>
  </div>
</template>

<script>
  import { PostCollection } from '~/resource'

  export default {
    props: {
      value: Array | Object,
    },
    data() {
      return {
        postCollection: PostCollection.getInstance(),
        noData: false,
      }
    },
    computed: {
      posts() {
        return this.value
      },
    },
    methods: {
      more() {
        this.postCollection
          .more()
          .then(() => {
            this.$emit('input', this.postCollection.list)
          })
          .catch((err) => {
            this.noData = true
          })
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/var.scss';
  .post-list {
    width: 100%;
    margin-bottom: 30px;
  }
  .post-list ul li {
    text-align: left;
    position: relative;
    width: 100%;
    margin: 0 0 15px;
    padding: 15px 10px 20px 10px;
    border-bottom: 1px solid #f0f0f0;
    line-height: 20px;
    display: flex;
    box-sizing: border-box;
    a:hover {
      text-decoration: underline;
      color: $primary;
    }
    .content {
      flex: 1;
    }
    .wrap-media {
      width: 150px;
      height: 100px;
      overflow: hidden;
      border-radius: 4px;
      margin-right: 20px;
      border: 1px solid #f0f0f0;
      align-items: center;
      vertical-align: middle;
      background-size: cover;
      background-position: center center;
      img {
        width: 100%;
        height: auto;
      }
    }
    .title {
      color: #333;
      font-size: 18px;
      font-weight: 700;
      line-height: 1.5;
      cursor: pointer;
    }
    .abstract {
      margin: 8px 0 8px;
      font-size: 13px;
      line-height: 20px;
      color: #999;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      p {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }
    .media {
      color: #b4b4b4;
      &,
      i {
        font-size: 12px;
      }
    }
    .tags {
      margin-right: 10px;
      color: #b4b4b4;
      a {
        color: #b4b4b4;
        padding: 0 2px;
      }
    }
    .category,
    .category a {
      color: $primary;
    }
  }
  .more {
    width: 100%;
    display: block;
    cursor: pointer;
  }
</style>