<template>
  <div id="post-list">
    <ul>
      <li
        v-for="(item,index) in list"
        :key="index"
        :class="`animation-other-${getAnimationIndex(index)}`"
      >
        <div
          class="wrap-media"
          v-show="item.featuredMediaModel.id"
          :class="{'unload':!item.featuredMediaModel.id}"
          :style="{'background-image':'url('+item.featuredMediaModel.source_url || svg+')'}"
        ></div>
        <div class="content">
          <a :href="`/posts/${item.id}`" class="title" v-html="item.title.rendered"></a>
          <div class="abstract" v-html="item.excerpt.rendered"></div>
          <div class="media">
            <span class="tags category" v-show="item.categoriesCollection.length">
              <i class="icon-column"></i>
              <a
                :href="`/category/${category.id}`"
                v-for="(category,idx) in item.categoriesCollection"
                :key="idx"
              >{{category.name}}</a>
            </span>
            <span class="tags" v-show="item.tagsCollection.length">
              <i class="icon-tag"></i>
              <a
                :href="`/tags/${tag.id}`"
                v-for="(tag,idx) in item.tagsCollection"
                :key="idx"
              >{{tag.name}}</a>
            </span>
            <a
              class="comment"
              :href="`/posts/${item.id}?#comment`"
              v-show="item.commentsCollection.length"
            >
              <i class="icon-comment"></i>
              {{item.commentsCollection.length}}
            </a>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import svg from '~/assets/images/logo-0.3.png'

  export default {
    props: {
      list: Array | Object,
    },
    data() {
      return {
        svg,
      }
    },
    methods: {
      getAnimationIndex(index) {
        ++index
        if (index % 10 === 0) {
          return 10
        } else {
          return index % 10
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/var.scss';
  #post-list {
    width: 100%;
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
  }
  #post-list ul li {
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
      &.unload {
        background-size: 50% 50%;
        background-position: center center;
        background-repeat: no-repeat;
        svg {
          path {
            fill: #ebebeb;
          }
        }
      }
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
      font-size: 13px!important;
      line-height: 20px;
      color: #999!important;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      p {
        font-size: 13px!important;
        line-height: 20px;
        color: #999!important;
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
        &:hover {
          color: $primary;
        }
      }
    }
    .comment {
      color: #b4b4b4;
      padding: 0 2px;
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
  .container {
    display: block;
    position: relative;
    li {
      transition: all 0.5s;
    }
  }
</style>