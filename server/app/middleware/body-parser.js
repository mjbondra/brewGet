
/**
 * Module dependencies
 */
var body = require('co-body')
  , busboy = require('co-busboy')
  , coFs = require('co-fs')
  , fs = require('fs')
  , uid = require('uid2');

module.exports = function (opts) {
  opts = opts || {};
  opts.uploadDir = opts.uploadDir || '/tmp'; 
  return function *(next) {
    if (this.is('application/x-www-form-urlencoded', 'application/json')) {
      this.request.body = yield body(this);
      yield next;
    } else if (this.is('multipart/form-data')) {
      var part, parts = busboy(this, { autoFields: true });
      while (part = yield parts) {
        var path = uid(15);
        part.pipe(fs.createWriteStream(opts.uploadDir + '/' + path));
      }
      this.request.body = yield parts.field;
      yield next;
      // yield coFs.unlink(); 
    } else yield next;
  }
}
