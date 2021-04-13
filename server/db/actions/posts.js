const { successInterceptor, failureInterceptor } = require('../interception');
const postsService = require('../../db/service/posts');
const isEmpty = require('lodash').isEmpty;

const action = (req, res) => {
  const that = this;
  switch (req.method) {
    case 'GET':
    case 'get':
      postsService.read(req, res).then(data => {
        return res.send(successInterceptor({req,res,data}));
      }).catch(err => {
        return res.send(failureInterceptor({ message: err.message }));
      })
      break;
    case 'POST':
    case 'post':
    default:
      postsService.create(req.body, req.query).then(data => {
        res.send(successInterceptor({req,res,data}));
      }).catch(err => {
        res.send(failureInterceptor({ message: err.message }));
      })
      break;
    case 'PUT':
      postsService.update(req.body).then(data => {
        res.send(successInterceptor({req,res,data}));
      });
      break;
  }
};
module.exports = action;