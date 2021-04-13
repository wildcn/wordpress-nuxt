<template>
  <li class="comment-box">
    <div class="avatar">
      <img v-if="item.author_avatar_urls" :src="item.author_avatar_urls" />
      <img :src="avatar" />
    </div>
    <div class="comment-main">
      <div class="meta">
        <div class="name">{{item.author_name}}</div>
        <div class="time">{{getTime(item.date)}}</div>
        <div class="floor" v-show="page">#{{page}}</div>
      </div>
      <div class="content" v-html="formatContent"></div>
      <slot name="tools"></slot>
      <div class="line"></div>
      <slot name="children"></slot>
    </div>
  </li>
</template>

<script>
  import md5 from 'md5'
  export default {
    props: {
      item: Object,
      index: Number | String,
    },
    computed: {
      page() {
        return this.index + 1
      },
      formatContent() {
        return decodeURIComponent(this.item.content).replace('\n', '<br />')
      },
      avatar() {
        return `https://cn.gravatar.com/avatar/${md5(this.item.author_email)}`
      },
    },
    methods: {
      getTime(data = this.postModel.date) {
        const { year, md, time } = this.$moment(data)
        return `${year}/${md} ${time}`
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '~/styles/var';
  .comment-box {
    display: flex;
    ul {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .avatar {
      width: 40px;
      height: 40px;
      margin-right: 10px;
      img {
        width: 100%;
        height: auto;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 50%;
      }
    }
    .comment-main {
      flex: 1;
    }
    &:last-child .content {
      margin-bottom: 0;
      padding-bottom: 0;
      border: none;
    }
    .meta {
      position: relative;
    }
    .name {
      font-size: 15px;
      font-weight: 500;
    }
    .time {
      font-size: 12px;
      color: #969696;
    }
    .floor {
      position: absolute;
      font-size: 12px;
      color: #969696;
      top: 0;
      right: 0;
    }
    .content {
      margin-top: 10px;
      font-size: 16px;
      line-height: 1.5;
      word-break: break-word;
    }
    .line {
      display: block;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
    .tools {
      span {
        cursor: pointer;
        &:hover {
          &,
          i {
            color: $primary;
          }
        }
      }
      span,
      i {
        color: #b0b0b0;
        font-size: 12px;
      }
      i {
        padding-right: 3px;
      }
    }
  }
</style>