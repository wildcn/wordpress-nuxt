const wp = require('./index')

wp.posts.read().then(data => {
  console.log("data", data)
})