<template>
  <div class="media-wall">
    <div class="title">照片墙</div>
    <div class="list">
      <li v-for="(item) in  list" :key="item.id">
        <a :href="`/posts/${item.post}`" :style="{'background-image':`url(${item.source_url})`}"></a>
      </li>
    </div>
  </div>
</template>

<script>
  import uniqBy from 'lodash'
  export default {
    name: 'media-wall',
    props: {
      collection: Object,
    },
    computed: {
      list() {
        const obj = {}
        const items = this.collection.list.filter((item) => item.post)
        if (items.length) {
          const result = items.reduce((res, item) => {
            if (!obj[item.post]) {
              res.push(item)
              obj[item.post] = 1
            }
            return res;
          }, [])
          return result
        }
        return items
      },
    },
  }
</script>

<style lang="scss" scoped>
  .media-wall {
    overflow: hidden;
    .list {
      width: calc(100% + 10px);
      padding: 0;
      display: flex;
      flex-wrap: wrap;
    }
    li {
      width: 90px;
      height: 90px;
      display: inline-block;
      margin-bottom: 0 !important;
      box-sizing: border-box;
      border: 1px solid #f9f9f9;
      overflow: hidden;
      a {
        width: 90px;
        height: 90px;
        display: block;
        background-size: cover;
        background-position: center center;
        transition: 0.5s all;
        &:hover {
          transform: scale(1.4);
        }
      }
    }
  }
</style>