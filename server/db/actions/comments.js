const { successInterceptor, failureInterceptor } = require('../interception');
const commentsService = require('../service/comments');

const action = (req, res) => {
  const that = this;
  switch (req.method) {
    case 'GET':
      commentsService.read(req, res).then(data => {
        res.send(successInterceptor({req,res,data}));
      }).catch(err => {
        res.send(failureInterceptor({ message: err.message }));
      })
      break;
    case "POST":
      commentsService.create(req, res).then(data => {
        res.send(successInterceptor({req,res,data}));
      }).catch(err => {
        res.send(failureInterceptor({ message: err.message }));
      })
      break;
  }
};
module.exports = action;