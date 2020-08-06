<template>
  <div class="page-tool">
    <div id="date">
      <div class="year">
        <span>{{time.year}}</span>
      </div>
      <div class="md">{{time.md}}</div>
      <div class="time">{{time.time}}</div>
    </div>
    <div class="page-btn" @click="rewardDialog = !rewardDialog" :class="{active:rewardDialog}">
      <div class="page-btn-icon">
        <i class="iconfont icon-qrcode"></i>
      </div>
      <p>打赏</p>
    </div>
    <div class="page-btn page-qrcode">
      <div class="page-btn-icon">
        <i class="iconfont icon-phone"></i>
      </div>
      <p>手机访问</p>
      <div id="qrcode-area" ref="qrcode"></div>
    </div>
    <el-dialog append-to-body title="感谢您的打赏" :visible.sync="rewardDialog">
      <div class="reward-dialog">
        <div class="wechat">
          <img src="http://cdn.dulianqiang.com/2020/08/wechat-dulianqiang.jpg" />
          <p>微信打赏</p>
        </div>
        <div class="zhifubao">
          <img src="http://cdn.dulianqiang.com/2020/08/zhifubao-dulianqiang.jpg" />
          <p>支付宝打赏</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      date: String | Object,
    },
    computed: {
      time() {
        const time = new Date(this.date)
        var year = time.getFullYear()
        var month = time.getMonth() - 1
        var day = time.getDay()
        var hour = time.getHours()
        var minute = time.getMinutes()
        var second = time.getSeconds()
        return {
          year,
          md: `${month}/${day}`,
          time: `${hour}:${minute}`,
        }
      },
    },
    data() {
      return {
        rewardDialog: false,
        mobileDialog: false,
      }
    },
    mounted() {
      this.generateQrcode(location.href)
    },
    methods: {
      generateQrcode(href) {
        if (process.client) {
          const QRCode = require('qrcodejs2')
          new QRCode(this.$refs.qrcode, {
            text: href,
            width: 150, //图像宽度
            height: 150, //图像高度
            colorDark: '#409eff', //前景色
            colorLight: '#f9f9f9', //背景色
            typeNumber: 4,
            correctLevel: QRCode.CorrectLevel.H, //容错级别 容错级别有：（1）QRCode.CorrectLevel.L （2）QRCode.CorrectLevel.M （3）QRCode.CorrectLevel.Q （4）QRCode.CorrectLevel.H
          })
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../styles/var';
  .page-tool {
    font-family: monospace;
    text-align: center;
    #date {
      .year {
        position: relative;
        color: #777;
        font-size: 18px;
        span {
          display: inline-block;
          background: #f9f9f9;
          padding: 0 5px;
        }
        &:after {
          content: '';
          display: block;
          width: 100%;
          height: 1px;
          background: #777;
          position: absolute;
          top: 50%;
          left: 0;
          z-index: -1;
        }
      }
      .md {
        font-size: 40px;
        color: #777;
      }
      .time {
        font-size: 14px;
        color: #999;
      }
    }
    .page-btn {
      color: #777;
      margin-top: 30px;
      position: relative;
      p {
        margin-top: 5px;
      }
      .page-btn-icon {
        transition: 0.5s all;
        margin: 0 auto;
        width: 50px;
        height: 50px;
        background-color: #fff;
        border-radius: 50%;
        vertical-align: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        cursor: pointer;
        i {
          line-height: 50px;
          font-size: 30px;
        }
      }
      &:hover .page-btn-icon,
      &.active .page-btn-icon {
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        color: $primary;
        animation: zy 2.5s 0.15s linear infinite;
        -moz-animation: zy 2.5s 0.15s linear infinite;
        -o-animation: zy 2.5s 0.15s linear infinite;
      }
      #qrcode-area {
        display: none;
        width: 180px;
        height: 180px;
        padding: 15px;
        box-sizing: border-box;
        position: absolute;
        right: -180px;
        background-color: #f9f9f9;
        top: 50%;
        transform: translateY(-50%);
      }
      &.page-qrcode:hover {
        #qrcode-area {
          display: grid;
        }
      }
    }
  }
  .reward-dialog {
    display: flex;
    .wechat,
    .zhifubao {
      text-align: center;
      flex: 1;
      img {
        width: 200px;
        height: 200px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      }
      p {
        color: #333;
      }
    }
  }
</style>