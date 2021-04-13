const { successInterceptor, failureInterceptor } = require('../interception');
const optionsService = require('../service/options');

const action = (req, res) => {
  const that = this;
  switch (req.method) {
    case 'GET':
    case 'get':
      optionsService.read(req, res).then(data => {
        res.send(successInterceptor({req,res,data}));
      }).catch(err => {
        res.send(failureInterceptor({ message: err.message }));
      })
      break;
  }
};
module.exports = action;