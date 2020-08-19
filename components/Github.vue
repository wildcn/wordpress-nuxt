<template>
  <div class="achievements item" v-show="repos.length">
    <div class="title">
      <i class="icon-github"></i>
      <a href="https://github.com/wildcn" target="_blank">https://github.com/wildcn</a>
    </div>
    <div class="repos" v-show="repos.length">
      <li v-for="(item,index) in repos" :key="index">
        <a :href="item.html_url" target="_blank">{{item.name}}</a>
        <div class="description" v-show="item.description">{{item.description}}</div>
        <div class="info">
          <span class="language" v-show="item.language">
            <i class="icon-language"></i>
            {{item.language}}
          </span>
          <span class="forks" v-show="item.forks">
            <i class="icon-fork"></i>
            {{item.forks}}
          </span>
          <span class="star" v-show="item.stargazers_count">
            <i class="icon-star"></i>
            {{item.stargazers_count}}
          </span>
        </div>
      </li>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        repos: [],
      }
    },
    mounted() {
      this.$github({
        url: 'https://api.github.com/users/wildcn/repos',
        method: 'get',
      }).then((data) => {
        if (data.status === 200) {
          this.repos = data.data
        }
      })
    },
  }
</script>

<style lang="scss" scoped>
  @import '~/styles/var';
  .achievements {
    .github {
      font-size: 16px;
      color: $primary;
      font-style: italic;
      a {
        color: $primary;
      }
      i {
        font-size: 14px;
      }
    }
    .repos {
      // margin: 20px 0px 20px 20px;
      padding: 0px;
      text-align: left;
      overflow-y: scroll;
      height: 455px;
      li {
        padding: 8px;
        border-radius: 2px;
        border-bottom: 1px solid #ebebeb;
        a {
          display: block;
          font-size: 18px;
          color: #333;
          margin-bottom: 5px;
        }

        &:hover {
          cursor: pointer;
          * {
            color: $primary;
          }
        }
        i {
          font-size: 14px;
        }
        .description {
          font-size: 12px;
          color: #999;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .info span {
          margin-top: 5px;
          font-size: 10px;
          font-weight: 500;
          border: 1px solid transparent;
          border-radius: 9px;
          padding: 0 10px;
          display: inline-block;
          line-height: 22px;
          background-color: #f1f8ff;
          color: #0366d6;
        }
      }
    }
  }
</style>