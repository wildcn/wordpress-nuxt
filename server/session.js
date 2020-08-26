var session = require('express-session');
var redisStore = require('connect-redis')(session);
var redis = require('redis');
const { cookieSecret, redisConfig } = require('./config');

const Session = session({
  name: 'transition-id', // 这里是cookie的name，默认是connect.sid
  secret: cookieSecret, // 建议使用 128 个字符的随机字符串
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 30
  },
  store: new redisStore({
    client: redis.createClient(redisConfig)
  })
})

module.exports = Session;