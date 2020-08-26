const express = require('express')
const consola = require('consola')
const bodyParser = require("body-parser");
const { Nuxt, Builder } = require('nuxt')
const cookie = require('./cookie');
const session = require('./session');
const axios = require('axios');
const cache = require('./cache');

const app = express()

//引入session
app.use(session)

// cookie
app.use(cookie);


// 使用 body-parser 中间
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(express.static('_nuxt', {
    maxAge: '24h'
  }))

  const BASE_URL = 'https://admin.dulianqiang.com/wp-json/wp/v2';
  let poolOn = false;
  let poolTask = [];
  function pool ({ req, res }) {
    const start = +new Date();
    if (poolOn) {
      poolTask.push({ req, res });
      return;
    }
    poolOn = true;
    axios.get(BASE_URL + req.url).then(data => {
      res.send(data.data);
      console.log("pool -> end", req.path, (+new Date() - start), 'poolTask length', poolTask.length)
      poolOn = false;
      if (poolTask.length) {
        const { path, res } = poolTask.shift();
        pool({ req, res });
      }
      cache.set(req.url, data.data)
    }).catch(err => { 
      console.error(err)
      res.send(err);
    })
  }
  app.use('/wp-json1/wp/v2', function (req, res) {
    cache.get(req.url).then(data => {
      console.log("get cache", req.path)
      res.send(data);
    }).catch(err => {
      pool({ req, res });
    })
  })
  app.use('/v1', (req, res) => {
    res.send({ message: 'success' })
  })

  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)



  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
