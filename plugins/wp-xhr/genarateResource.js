const axios = require('axios');
const { isNumber, isArray } = require('lodash');
const { TYPES, BASE_URL } = require('../../constants/api');
const { db2webData, web2dbData } = require('../../server/db/utils/transform')

const generatePoolReq = require('./pool-request');

const baseURL = process.env.baseUrl || 'localhost:3000';

const APIS = Object.keys(TYPES).reduce((obj, key) => Object.assign(obj, { [key]: `${BASE_URL}${TYPES[key]}` }), {})

const resouce = {};

Object.keys(APIS).forEach(api => {
  const path = APIS[api];
  const type = TYPES[api];
  // 默认get请求
  resouce[type] = {
    read: (params = {}) => {
      const { id } = params;
      return new Promise((resolve, reject) => {
        if (getSingularId(id)) {
          params.id = getSingularId(id);
          // 存在idquery
          return generatePoolReq({ params, resolve, reject, path, type })
        }
        axios.get(`${baseURL}${path}`, { params }).then(response => {
          if (response.status === 200 && response.data.code == 0) {
            resolve(response.data.data);
          }
        }).catch(err => reject(err));
      })
    },
    create: function (opts) {
      return axios.post(`${baseURL}${path}`, opts)
    }
  }
})

const getSingularId = id => {
  if (isNumber(+id)) {
    return +id;
  }
  if (isArray(id) && id.length === 1) {
    return id[0]
  }
  return false;
}
module.exports = resouce;