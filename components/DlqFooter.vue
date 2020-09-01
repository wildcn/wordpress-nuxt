<template>
  <div class="footer">
    <div class="links">
      <span>友情链接：</span>
      <span>
        <a target="_blank" href="https://www.jianshu.com/">简书</a>
      </span>
      <span>
        <a target="_blank" href="https://www.zhihu.com/">知乎</a>
      </span>
      <span>联系我 Email:</span>
      <span class="primary">wildcn#qq.com</span>
      <span>#换成@</span>
    </div>
    <div class="copyright">
      <span>@2020</span>
      <span>备案号 京ICP备15015718号</span>
      <span>博客基于Nuxt和Wordpress打造</span>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        version: process.env
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import '~/styles/var';
  .footer {
    margin: 20px auto;
    span,
    a {
      color: #969696;
      font-size: 12px;
      line-height: 1.6em;
    }
    a:hover {
      color: $primary;
      text-decoration: underline;
    }
  }
</style>