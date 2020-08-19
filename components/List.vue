<template>
  <div class="item">
    <div class="title">网络文学</div>
    <ul class="list">
      <li v-for="(item,index) in list" :key="index">
        <a :href="`/posts/${item.id}`">
          <p>{{item.title.rendered}}</p>
        </a>
        <p class="des">
          <span class="excerpt" v-html="item.excerpt.rendered"></span>
        </p>
        <div class="info"></div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      list: Array,
    },
  }
</script>

<style lang="scss" scoped>
</style>