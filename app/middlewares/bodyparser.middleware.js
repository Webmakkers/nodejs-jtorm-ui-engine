/*! (c) jTorm and other contributors | https://jtorm.com/license */

const bodyParser = require('koa-bodyparser');

module.exports = function (app) {
  app.use(bodyParser());
};
