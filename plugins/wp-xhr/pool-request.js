const axios = require('axios');
const { db2webData, web2dbData } = require('../../server/db/utils/transform')
const baseURL = process.env.baseUrl || 'localhost:3000';

// 对于id的查询，可以走批量接口
const requestPool = {};
const timerAggregator = {};
// 批量请求的限制时间
const POOL_TIME_LIMIT = 100;
// 批量请求的限制次数
const POOL_MAX_LIMIT = 25;

const generatePoolReq = ({ path, params, resolve, reject, type }) => {
  const { id } = params;
  delete params.id;
  const key = `${path}?params=${JSON.stringify(params)}&type=${type}&aciton=id`
  params.id = id;
  requestPool[key] = requestPool[key] || [];
  // 判断在有效时间内，清空定时器
  requestPool[key].push({ resolve, reject, path, params, type });
  clearTimeout(timerAggregator[key]);
  timerAggregator[key] = setTimeout(() => {
    // 定时器有效时，执行批量请求
    cashRequestPool({ payload: requestPool[key], path, params, type });
    // delete requestPool[key];
  }, POOL_TIME_LIMIT);
}

const cashRequestPool = ({ path, params, payload, type }) => {
  // 获取批量id
  const ids = payload.map(item => item.params.id);
  axios.get(`${baseURL}${path}`, { params }).then(response => {
    if (response.status === 200 && response.data.code == 0) {
      const res = response.data.data;
      if (res.rows && res.rows.length) {
        const responseById = new Map();
        res.rows.forEach(item => {
          const webData = db2webData(item, type);
          responseById.set(webData.id, item)
        })
        // 返回response
        payload.forEach(item => {
          if (responseById.get(item.params.id)) {
            item.resolve({
              rows: [responseById.get(item.params.id)]
            })
          }

        })
      }
    }
  }).catch(err => {
    payload.forEach(item => {
      item.reject(err)
    })
  });
}

module.exports = generatePoolReq;