<template>
  <div class="nav">
    <div class="content">
      <div class="menu">
        <el-menu
          mode="horizontal"
          background-color="#373938"
          :menu-trigger="menuTrigger"
          active-text-color="#ffffff"
          unique-opened
        >
          <el-menu-item index="/">
            <nuxt-link to="/">HOME</nuxt-link>
          </el-menu-item>
          <component
            :is="item.children?'el-submenu':'el-menu-item'"
            v-for="(item,index) in categories"
            :key="index"
            :index="`/category/${item.id}`"
          >
            <template v-if="item.children" slot="title">
              <nuxt-link :to="`/category/${item.id}`">{{item.name}}</nuxt-link>
            </template>
            <el-menu-item
              v-show="item.children"
              v-for="(child,idx) in item.children"
              :key="idx"
              :index="`/category/${child.id}`"
            >
              <nuxt-link :to="`/category/${child.id}`">{{child.name}}</nuxt-link>
            </el-menu-item>
            <template v-if="!item.children">
              <nuxt-link :to="`/category/${item.id}`">{{item.name}}</nuxt-link>
            </template>
          </component>
        </el-menu>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'dlq-header',
    data() {
      return {
        rootCategories: [],
        menuTrigger: process.env.NODE_ENV === 'development' ? 'click' : 'hover',
      }
    },
    computed: {
      ...mapState(['categoryCollection']),
      categories() {
        if (!this.categoryCollection.list) {
          return []
        }
        const { list, mapList } = this.categoryCollection
        const map = JSON.parse(JSON.stringify(mapList))
        try {
          list.forEach((item) => {
            if (map[item.parent]) {
              map[item.parent].children = map[item.parent].children || []
              map[item.parent].children.push(item)
              delete map[item.id]
            }
          })
        } catch (er) {
          console.log(er)
        }
        return Object.values(map)
      },
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
  }
</style>