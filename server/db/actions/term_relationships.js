const { successInterceptor, failureInterceptor } = require('../interception');
const termRelationshipsService = require('../service/term_relationships');

const action = (req, res) => {
  const that = this;
  switch (req.method) {
    case 'GET':
      termRelationshipsService.read(req, res).then(data => {
        res.send(successInterceptor({req,res,data}));
      }).catch(err => {
        res.send(failureInterceptor({ message: err.message }));
      })
      break;
    case "POST":
      termRelationshipsService.create(req, res).then(data => {
        res.send(successInterceptor({req,res,data}));
      }).catch(err => {
        res.send(failureInterceptor({ message: err.message }));
      })
      break;
  }
};
module.exports = action;