<template>
  <div class="card item">
    <div class="avatar">
      <img src="http://cdn.dulianqiang.com/2020/08/未标题-5.jpg" />
      <img src="http://cdn.dulianqiang.com/2020/08/未标题-5.jpg" />
      <img src="http://cdn.dulianqiang.com/2020/08/未标题-5.jpg" />
    </div>
    <div class="introduce">
      <div class="name">
        <span>杜连强</span>
      </div>
      <div class="autograph">
        <p>
          合抱之木
          <i class="icon-mu"></i>生于毫末
        </p>
        <p>
          九层之台
          <i class="icon-tu"></i>起于累土
        </p>
        <p>
          千里之行
          <i class="icon-target"></i>始于足下
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {}
</script>

<style lang="scss" scoped>
  @import '~/styles/var.scss';
  .card {
    width: 300px;
    margin: 20px auto;
    box-sizing: border-box;
    .avatar {
      width: 200px;
      height: 150px;
      margin: 0 auto;
      overflow: hidden;
      position: relative;
      img {
        width: 150px;
        height: 150px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        border: 1px solid #b3b3b3;
        border-radius: 50%;
        opacity: 0.2;
        &:nth-child(2) {
          left: 25px;
          z-index: 3;
          opacity: 1;
        }
        &:nth-child(3) {
          left: 50px;
          z-index: 1;
          opacity: 0.2;
        }
      }
    }
  }
  .introduce {
    padding-bottom: 10px;
    .name {
      font-size: 18px;
      color: #333;
      position: relative;
      width: 120px;
      display: inline-block;
      &:before,
      &:after {
        content: '';
        display: block;
        width: 30px;
        height: 1px;
        background: #999;
        position: absolute;
        top: 50%;
        left: 0;
        z-index: 1;
      }
      &:after {
        left: auto;
        right: 0;
      }
    }
    .autograph {
      margin-top: 5px;
      font-size: 10px;
      color: #999;
      line-height: 18px;
      // p:nth-child(2){
      //   font-size: 14px;
      // }
      // p:nth-child(3){
      //   font-size: 16px;
      // }
      i {
        font-size: 14px;
        padding: 0 3px;
      }
    }
  }
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
      height: 500px;
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