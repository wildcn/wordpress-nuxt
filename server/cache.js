const { redisConfig, REDIS_EXPIRE_TIME } = require('./config')
let redis = require("redis");
const redisClient = redis.createClient(redisConfig);

module.exports = {
  set: (key, val, expireTime = REDIS_EXPIRE_TIME) => {
    redisClient.set(key, JSON.stringify(val));
    redisClient.expire(key, expireTime);
  },
  get: key => new Promise((resolve, reject) => {
    redisClient.get(key, function (err, val) {
      if (err != null || val == null) {
        reject(err);
      } else {
        try {
          resolve(JSON.parse(val));
        } catch (err) {
          reject(err)
        }
      }
    })
  }),
  // 设置过期时间
  expire: (key, expireTime) => redisClient.expire(key, expireTime),
  del: key => redisClient.del(key),
  exists: key => redisClient.exists(key),
  auth: pd => redisClient.auth(pd),
  // 清空数据库
  flushdb: redisClient.flushdb()
}