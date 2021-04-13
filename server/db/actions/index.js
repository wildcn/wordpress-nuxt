
const { successInterceptor, failureInterceptor } = require('../interception');
const { TYPES } = require('../../../constants/api')
const fs = require('fs');
const path = require('path');
const resolve = dir => path.resolve(__dirname, dir);
const modelPath = resolve('./') + '/';
const files = fs.readdirSync(modelPath);
const js_files = files.filter((f) => {
  return f.endsWith('.js') && !/index/.test(f);
}, files);

const cache = require('../../cache');


for (let f of js_files) {
  const name = f.replace('.js', '');
  module.exports[`${name}Action`] = (req, res) => {
    const fn = require(modelPath + f);

    // fn(req, res);
    // return;
    // 代理所有请求，走缓存
    if (name === TYPES.OPTIONS || name === TYPES.COMMENTS || req.query.disableCache) {
      fn(req, res);
      return;
    }
    const url = req.originalUrl;
    cache.get(url).then(data => {
      res.send(successInterceptor({ req, res, cache: 1, data: JSON.parse(data) }));
    }).catch(err => {
      console.log("err", err)
      fn(req, res);
    })
  };
} 