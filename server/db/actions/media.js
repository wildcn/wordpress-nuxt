const { successInterceptor, failureInterceptor } = require('../interception');
const mediaService = require('../service/media');

const action = (req, res) => {
  const that = this;
  switch (req.method) {
    case 'GET':
      mediaService.read(req, res).then(data => {
        res.send(successInterceptor({req,res,data}));
      }).catch(err => {
        res.send(failureInterceptor({ message: err.message }));
      })
      break;
  }
};
module.exports = action;