<template>
  <div class="container page-component__scroll">
    <el-backtop class="top" :bottom="10">
      <i class="icon-top"></i>
    </el-backtop>
    <dlq-header></dlq-header>
    <div class="content">
      <Nuxt />
    </div>
  </div>
</template>
<script>
  import Header from '../components/Header'
  import DlqFooter from '../components/DlqFooter'
  export default {
    middleware: 'categories',
    components: {
      DlqHeader: Header,
      DlqFooter,
    },
  }
</script>

<style lang="scss" scoped>
  .container {
    margin: 0 auto;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 60px;
    overflow: hidden;
  }
  .content {
    display: block;
    background-color: #f9f9f9;
    overflow: hidden;
    margin-bottom: 50px;
  }
  .main {
    margin: 960px;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
  }
  .top i {
    font-size: 30px;
  }
</style>