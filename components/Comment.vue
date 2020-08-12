<template>
  <div class="comment-tools">
    <div class="content">
      <el-input class="input" :rows="2" placeholder="期待您的评论" v-model="content"></el-input>
      <el-button
        title="发送"
        @click="sendComment"
        circle
        icon="iconfont icon-send"
        v-show="content"
        type="primary"
      ></el-button>
      <el-button title="撤销" circle icon="iconfont icon-cancel" v-show="content"></el-button>
     
      <span class="btn">
        <el-button circle icon="el-icon-share" type="info"></el-button>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        content: '',
      }
    },
    methods: {
      sendComment() {
        if (this.content) {
          this.$emit('update', { content: this.content })
        }
      },
    },
  }
</script>

<style lang="scss">
  .comment-tools {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    padding: 20px 0;
    .content {
      width: 960px;
      margin: 0 auto;
      text-align: left;
      .input {
        width: 500px;
        margin-right: 10px;
        input,
        .el-input__inner {
          background-color: #f9f9f9 !important;
          border-color: #fff;
          border-radius: 20px;
          color: rgb(64, 64, 64);
        }
      }
      .el-button {
        margin-left: 0;
        padding: 10px;
      }
    }
    .btn {
      margin-left: 20px;
    }
  }
</style>