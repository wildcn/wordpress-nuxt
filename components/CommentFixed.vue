<template>
  <div ref="commentTools" class="comment-tools" @blur="cancel">
    <div class="content">
      <div class="reply" v-if="reply.id">
        <span class="reply-author_name">@{{reply.author_name}}</span>
        <span class="reply-content" v-html="reply.content.rendered"></span>
        <a @click="$emit('cancel')" class="close" href="javascript:;">
          <i class="el-icon el-icon-close"></i>
        </a>
      </div>
      <div class="main">
        <el-input
          ref="input"
          class="input"
          :class="{'active':inputActive}"
          v-bind="inputParam"
          @focus="inputFocus"
          type="textarea"
          placeholder="期待您的评论"
          v-model="content"
        ></el-input>
        <el-button
          :disabled="!content"
          title="发送"
          @click="sendComment"
          circle
          icon="icon-send"
          v-show="inputActive"
          type="primary"
        ></el-button>
        <el-button @click="cancel" title="撤销" circle icon="icon-cancel" v-show="inputActive"></el-button>
        <a class="comment-static" v-show="!inputActive" href="#comment">
          <i class="icon-comment"></i>
          评论{{postModel.commentsCollection.length}}
        </a>
        <span class="btn" v-show="!inputActive">
          <a href="javascript:;" :class="{active:wechatShare}" @click="wechatShare=true">
            <i class="icon-wechat"></i>
          </a>
        </span>
      </div>
      <div class="main main2" v-show="inputActive">
        <div class="item">
          <span>
            <i class="icon-required"></i>姓名
          </span>
          <el-input v-model="author_name" class="input" type="input"></el-input>
        </div>
        <div class="item">
          <span>
            <i class="icon-required"></i>邮箱
          </span>
          <el-input v-model="author_email" class="input" type="input"></el-input>
        </div>
        <div class="item">
          <el-checkbox class="cache-visitor" v-model="cacheVisitor"></el-checkbox>
          <span>记住姓名、邮箱</span>
        </div>
      </div>
    </div>

    <el-dialog width="500px" append-to-body class="wechat-share-dialog" :visible.sync="wechatShare">
      <div class="des">打开微信“扫一扫”，打开网页后点击屏幕右上角分享按钮</div>
      <template slot="title">
        <div class="title">微信分享</div>
      </template>
      <Qrcode class="qrcode"></Qrcode>
    </el-dialog>
  </div>
</template>

<script>
  import Qrcode from '../components/Qrcode'
  import { CommentCollection } from '../resource'

  const commentCollection = CommentCollection.getInstance()
  export default {
    props: {
      value: String,
      reply: Object,
      postModel: Object,
      commentList: Array,
    },
    components: {
      Qrcode,
    },
    mounted() {
      this.getVisitorInfo()
      document.addEventListener('click', (e) => {
        if (!this.$el.contains(e.target)) {
          this.inputActive = false //点击其他区域关闭
        }
      })
    },
    data() {
      return {
        content: this.value,
        author_name: '',
        author_email: '',
        inputParam: {
          rows: 1,
        },
        cacheVisitor: true,
        inputActive: false,
        wechatShare: false,
      }
    },
    watch: {
      content(val) {
        this.$emit('input', val)
      },
      value(val) {
        this.content = val
      },
      inputActive(val) {
        if (val) {
          this.inputParam.rows = 2
        } else {
          this.inputParam.rows = 1
        }
      },
      cacheVisitor(val) {
        if (val) {
          this.cacheVisitorInfo()
        } else {
          localStorage.removeItem('visitor')
        }
      },
    },
    methods: {
      cacheVisitorInfo() {
        localStorage.setItem(
          'visitor',
          JSON.stringify({
            author_name: this.author_name,
            author_email: this.author_email,
          })
        )
      },
      getVisitorInfo() {
        const visitorStr = localStorage.getItem('visitor')
        if (visitorStr) {
          try {
            const { author_name, author_email } = JSON.parse(visitorStr)
            this.author_name = author_name
            this.author_email = author_email
          } catch (err) {}
        }
      },
      sendComment() {
        if (this.content) {
          const param = { content: this.content }
          if (this.author_name) {
            param.author_name = this.author_name
          } else {
            this.$message.warning('姓名为必填项')
            return
          }
          if (this.author_email) {
            param.author_email = this.author_email
            param.author_url = this.author_email
          } else {
            this.$message.warning('邮箱为必填项')
            return
          }
          const commentAuthors =
            []
              .concat(commentCollection.list, this.commentList)
              .reduce(
                (res, item) =>
                  Object.assign(res, {
                    [item.author_name]: item.author_url.replace(/http:\/\//, ''),
                  }),
                {}
              ) || {}

          if (commentAuthors[this.author_name]) {
            if (this.author_email !== commentAuthors[this.author_name]) {
              this.$message.error('评论用户冲突，请确认姓名和邮箱填写正确！')
              return
            }
          }

          this.$emit('update', param)
          this.cacheVisitorInfo()
          this.inputActive = false
        }
      },
      inputFocus() {
        this.inputActive = true
      },
      cancel() {
        this.$emit('input', '')
        this.inputActive = false
        this.$emit('cancel')
        if (!this.cacheVisitor) {
          this.author_name = ''
          this.author_email = ''
        }
      },
    },
  }
</script>

<style lang="scss">
  @import '~/styles/var';
  .comment-tools {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    padding: 10px 0;
    transition: 0.3s all;
    .reply {
      width: 500px;
      text-align: left;
      margin-bottom: 10px;
      position: relative;
      min-height: 36px;
      line-height: 36px;
      display: flex;
      & > * {
        height: 36px;
      }
      .reply-author_name {
        color: $primary;
        margin-right: 10px;
      }
      .reply-content {
        flex: 1;
        display: inline-block;
        vertical-align: top;
        word-break: break-all;
        overflow: hidden;
      }
      .close {
        width: 36px;
        height: 36px;
        box-sizing: border-box;
        margin-left: 10px;
        display: inline;
        border-radius: 50%;
        background-color: #f9f9f9;
        text-align: center;
        transition: 0.2s all;
        &:hover {
          background-color: $danger;
          i {
            color: #f9f9f9;
          }
        }
      }
      span,
      i {
        color: #333;
        font-size: 14px;
      }
      p {
        display: inline-block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .content {
      width: 960px;
      margin: 0 auto;
      text-align: left;
      .input {
        width: 500px;
        margin-right: 10px;
        &.active .el-textarea__inner {
          border-radius: 5px;
          line-height: 24px;
          height: 72px !important;
          padding: 10px 20px;
        }
        .el-textarea__inner {
          background-color: #f9f9f9 !important;
          border-color: #fff;
          border-radius: 20px;
          color: rgb(64, 64, 64);
          resize: none;
          height: 36px !important;
          line-height: 36px !important;
          padding: 0 20px;
          font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
        }
      }
      .el-button {
        margin-left: 0;
        padding: 10px;
      }
      .comment-static {
        font-size: 14px;
        color: #999;
        height: 38px;
        line-height: 38px;
        &:hover {
          color: $primary;
        }
      }
      .main {
        .el-input__inner {
          background-color: #f9f9f9 !important;
          border-color: #fff;
          border-radius: 5px;
          color: rgb(64, 64, 64);
          resize: none;
          height: 36px;
          line-height: 36px;
          padding: 0 20px;
          font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
        }
      }
      .main2 {
        margin-top: 10px;
        display: flex;
        width: 700px;
        .icon-required {
          color: $danger;
        }
        .item {
          .input {
            display: inline-block;
            width: auto;
          }
          line-height: 36px;
          &:last-child {
            flex: 1;
          }
        }
        .cache-visitor {
          // padding-right: 5px;
        }
      }
    }
    .btn {
      a {
        width: 36px;
        height: 36px;
        line-height: 36px;
        background-color: #f9f9f9;
        display: inline-block;
        border-radius: 50%;
        box-sizing: border-box;
        border: 1px solid $wechatPrimary;
        border-color: rgba($color: $wechatPrimary, $alpha: 0.1);
        text-align: center;
        color: $wechatPrimary;
        transition: 0.3s all;
        &:hover,
        &.active {
          background-color: $wechatPrimary;
          color: #fff;
        }
        i {
          font-size: 22px;
        }
      }
      margin-left: 20px;
      i {
        font-size: 18px;
      }
    }
  }
  .wechat-share-dialog {
    .title {
      font-size: 24px;
      text-align: center;
    }
    .des {
      margin-bottom: 20px;
      text-align: center;
    }
  }
</style>