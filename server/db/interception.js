const { TYPES, _fields } = require('../../constants/api');
const { db2webData } = require('./utils/transform')
const { isArray, isPlainObject } = require('lodash');
const cacheService = require('../cache');

// 请求成功后的拦截器
const successInterceptor = ({ req, res, data, cache = 0 }) => {
  const { originalUrl } = req;
  const type = originalUrl.split('/').pop();
  // 过滤响应数据数据，转换数据库字段为web字段
  if (isArray(data)) {
    data = data.map(item => {
      if (isPlainObject(item)) {
        return db2webData(item, type)
      }
      return item;
    })
  } else if (isPlainObject(data)) {
    if (data.rows) {
      data.rows = data.rows.map(item => db2webData(item, type));
    } else {
      data = db2webData(data, type)
    }
  }else{
    data = db2webData(data, type)
  }

  cacheService.set(originalUrl, JSON.stringify(data), 3600);
  return {
    data,
    cache,
    code: 0
  }
}
// 请求失败的拦截器
const failureInterceptor = err => {
  const message = err instanceof Error ? err.message : err;
  return {
    code: -1,
    message
  }
}


module.exports = {
  successInterceptor,
  failureInterceptor
}