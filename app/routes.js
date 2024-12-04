/*! (c) jTorm and other contributors | https://jtorm.com/license */

const
  {compileApiController} = require('@controllers/api/compile-api.controller')
;

module.exports = router => {
  router.post('/api/compile/:language', compileApiController.postAction);
};
