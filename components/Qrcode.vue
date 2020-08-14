<template>
  <div id="qrcode-area" ref="qrcode"></div>
</template>

<script>
  export default {
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
            colorDark: '#000', //前景色
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
  #qrcode-area {
    width: 180px;
    height: 180px;
    margin: 0 auto;
    padding: 15px;
    box-sizing: border-box;
    background-color: #f9f9f9;
    transition: 0.5s all;
  }
</style>