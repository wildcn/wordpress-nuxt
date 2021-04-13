const Sequelize = require('sequelize');
const dbConnect = require('../dbConnect.js');
const dbPrefix = require('../config').db_prefix;
/**
 * 生成全量curd
 */
const Service = Model => {
  return {
    model: () => Model,
    create: (data) => {
      data.createAt = data.createAt || +new Date();
      return Model.create(data);
    },
    update: (data, id) => {
      data.updateAt = data.updateAt || +new Date();
      return Model.update(data, { where: { id: id } });
    },
    read: (params) => {
      return Model.findAll(params);
    },
    findOne: params => Model.findOne(params),
    findAndCountAll: params => Model.findAndCountAll(params),
    findAll: params => Model.findAll(params),
    delete: (query) => {
      return Model.destroy({ where: query });
    }
  }
};

// 读取models
const fs = require('fs');
const path = require('path');
const resolve = dir => path.resolve(__dirname, dir);
const modelPath = resolve('./') + '/';
const files = fs.readdirSync(modelPath);
const js_files = files.filter((f) => {
  return f.endsWith('.js') && !/index/.test(f);
}, files);


for (let f of js_files) {
  const { dbName, columns } = require(modelPath + f);
  const name = dbPrefix + dbName;
  const Model = dbConnect.define(name, columns, {
    timestamps: false,               // 不要默认时间戳
    tableName: name,

  });
  module.exports[`${dbName}Model`] = Model;
}