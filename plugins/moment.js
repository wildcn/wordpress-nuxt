import Vue from 'vue';
var moment = date => {
  const time = new Date(date)
  var year = time.getFullYear()
  var month = time.getMonth() + 1
  var day = time.getDate()
  var hour = time.getHours()
  var minute = time.getMinutes()
  var second = time.getSeconds()
  return {
    year,
    md: `${month}/${day}`,
    time: `${hour}:${minute}`,
  }
}
Vue.prototype.$moment = moment;