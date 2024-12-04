/*! (c) jTorm and other contributors | www.jtorm.com/license */

const compress = require('koa-compress');

module.exports = function (app) {
  app.use(compress({
    filter (content_type) {
      return true;
    },
    threshold: 1,
    gzip: {
      flush: require('zlib').constants.Z_SYNC_FLUSH
    },
    deflate: {
      flush: require('zlib').constants.Z_SYNC_FLUSH,
    },
    br: true
  }));
};
