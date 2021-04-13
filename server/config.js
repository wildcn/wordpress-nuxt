const serverIp = process.env.NODE_ENV = 'development' ? '127.0.0.1 : '127.0.0.1';

module.exports = {
  cookieSecret: 'tubage097633XX09763333', // cookie加密秘钥
  // redis连接配置
  redisConfig: {
    host: serverIp,
    port: '6379',
    db: 0,
    password: 'tubage097633'
  },
  // mysql连接配置
  mysqlConfig: {
    username: 'root',
    password: 'tubage097633',
    host: serverIp,
    database: 'dulianqiang',
    db_prefix: 'wp_' // 表字段头
  }
};