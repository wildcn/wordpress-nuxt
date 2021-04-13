const express = require('express')
const consola = require('consola')
const bodyParser = require("body-parser");
// const { Nuxt, Builder } = require('nuxt')
const cookie = require('./cookie');
const session = require('./session');
const axios = require('axios');
const cache = require('./cache');
const { resource } = require('./db');
const { port, host } = require('./config')

const app = express()

//引入session
app.use(session)


// cookie
app.use(cookie);



// 使用 body-parser 中间
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//设置跨域访问
app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

Object.keys(resource).forEach(api => {
  app.use(api, resource[api]);
})

// Import and Set Nuxt.js options
// const config = require('../nuxt.config.js')
// config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  // Init Nuxt.js
  // const nuxt = new Nuxt(config)

  // const { host, port } = nuxt.options.server

  // await nuxt.ready()
  // Build only in dev mode
  // if (config.dev) {
  //   const builder = new Builder(nuxt)
  //   await builder.build()
  // }

  // Give nuxt middleware to express
  app.use(express.static('_nuxt', {
    maxAge: '24h'
  }))

  // app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)



  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
