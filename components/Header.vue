<template>
  <div class="nav">
    <div class="logo">
      <nuxt-link to="/">
        <Logo></Logo>
      </nuxt-link>
    </div>
    <div class="content">
      <div class="menu">
        <el-menu
          mode="horizontal"
          background-color="#373938"
          :menu-trigger="menuTrigger"
          active-text-color="#ffffff"
          unique-opened
        >
          <component
            :is="item.children?'el-submenu':'el-menu-item'"
            v-for="(item,index) in categories"
            :key="index"
            :index="`/category/${item.id}`"
          >
            <template v-if="item.children" slot="title" index="/category">
              {{item.name}}
            </template>
            <el-menu-item class="sub-title">
              <nuxt-link :to="`/category/${item.id}`">{{item.name}}</nuxt-link>
            </el-menu-item>
            <el-menu-item
              v-show="item.children"
              v-for="(child,idx) in item.children"
              :key="idx"
              :index="`/category/${child.id}`"
            >
              <nuxt-link :to="`/category/${child.id}`">{{child.name}}</nuxt-link>
            </el-menu-item>
            <template v-if="!item.children" index="/category">
              <nuxt-link :to="`/category/${item.id}`">{{item.name}}</nuxt-link>
            </template>
          </component>
        </el-menu>
      </div>
    </div>
  </div>
</template>

<script>
  import { CategoryCollection } from '../resource'
  import Logo from './Logo'
  export default {
    name: 'dlq-header',
    components: {
      Logo,
    },
    data() {
      return {
        rootCategories: [],
        categoryCollection: CategoryCollection.getInstance(),
        menuTrigger: process.env.NODE_ENV === 'development' ? 'click' : 'hover',
      }
    },
    computed: {
      categories() {
        if (!this.categoryCollection.list.length) {
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
      display: flex;
      transform: translateX(-50%);
    }
  }
  .menu {
    flex: 1;
    width: 960px;
    text-align: left;
    padding: 0 10px;
  }
  .logo {
    display: inline-block;
    height: 50px;
    position: absolute;
    top: 5px; 
    left: 15px;
    a {
      display: block;
      height: 100%;
    }
    img {
      height: 100%;
      width: auto;
      &:hover {
        fill: $primary;
      }
    }
  }
</style>