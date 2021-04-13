const { dbFields, webFields } = require('../constants/dbFieldMaping');
const { isPlainObject, isArray } = require('lodash');

const transformDataFileds = (config, data, type, strict) => {
  if (!type) {
    return data;
  }
  const map = config[type];
  if (!map) {
    return data;
  }
  const _data = JSON.parse(JSON.stringify(data));
  
  for (let key in _data) {
    if (map[key]) {
      _data[map[key]] = _data[key];
      delete _data[key];
    }
    // 严格模式，且key不在目标数组内
    if (strict) {
      delete _data[key];
    }
  }
  return _data;
}

const transformFields = (config, data, type, strict) => {
  if (!type) {
    return data;
  }
  const map = config[type];
  if (!map) {
    return data;
  }

  let result = [];
  [].concat(data).forEach(key => {
    if (map[key]) {
      result.push(map[key]);
    } else {
      !strict && result.push(key);
    }
  })

  return result;

}

const db2web = (data, type, strict) => transformFields(dbFields, data, type, strict);
const web2db = (data, type, strict) => transformFields(webFields, data, type, strict);

const db2webData = (data, type, strict) => transformDataFileds(dbFields, data, type, strict);
const web2dbData = (data, type, strict) => transformDataFileds(webFields, data, type, strict);



module.exports = {
  db2web,
  web2db,
  db2webData,
  web2dbData
}