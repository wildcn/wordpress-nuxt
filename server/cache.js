const redisConfig = {
  host: '47.96.10.90',
  port: '6379',
  db: 0,
  password: 'tubage097633'
};
let redis = require("redis");
const redisClient = redis.createClient(redisConfig);

const CONSTANTS = {
  EXPIRE_TIME: 60 * 60 * 24 // 默认过期时间
}

module.exports = {
  set: (key, val, expireTime = CONSTANTS.EXPIRE_TIME) => {
    redisClient.set(key, JSON.stringify(val));
    redisClient.expire(key, expireTime);
  },
  get: key => new Promise((resolve, reject) => {
    redisClient.get(key, function (err, val) {
      if (err != null || val == null) {
        reject(err);
      } else {
        try{
          resolve(JSON.parse(val));
        }catch(err){
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