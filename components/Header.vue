<template>
  <div class="nav">
    <div class="content">
      <div class="menu">
        <li v-for="(item,index) in rootCategories" :key="index">
          <a :href="item.link">{{item.name}}</a>
        </li>
      </div>
    </div>
  </div>
</template>

<script>
  import { CategoryModel, CategoryCollection } from '../resource'
  export default {
    name: 'dlq-header',
    data() {
      return {
        categories: [],
        rootCategories: [],
        categoryCollection: CategoryCollection.getInstance(),
      }
    },
    async mounted() {
      console.log("mounted -> this.categoryCollection", this.categoryCollection)
      this.rootCategories = await this.categoryCollection.fetchRootCategories()
    },
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/var.scss';
  .nav {
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
      min-width: 768px;
      max-width: 1440px;
      margin: 0 auto;
      position: absolute;
      top: 0;
      left: 50%;
      height: 60px;
      transform: translateX(-50%);
    }
  }
  .menu {
    width: 960px;
    text-align: left;
    padding: 0 10px;
    li {
      display: inline-block;
      // width: 100px;
      height: 60px;
      padding: 0 20px;
      line-height: 60px;
      font-size: 16px;
      &:first-child {
        padding-left: 0;
      }
      a {
        color: #f1f1f1;
        &:hover {
          color: $primary;
        }
      }
    }
  }
</style>