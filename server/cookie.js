var cookieParser = require('cookie-parser');
const cookieSecret = require('./config').cookieSecret;
const cp = cookieParser(cookieSecret);

module.exports = cp;