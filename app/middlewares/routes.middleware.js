/*! (c) jTorm and other contributors | https://jtorm.com/license */

const
  Router = require('@koa/router')
;

module.exports = function (app) {
  const router = new Router();
  require('@app/routes')(router);

  app.use(router.allowedMethods());
  app.use(router.routes());
};
