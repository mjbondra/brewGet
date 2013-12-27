
/**
 * Module dependencies
 */
var body = require('co-body')
  , busboy = require('co-busboy')
  , fs = require('fs');

module.exports = function (config) { 
  return function *(next) {
    if (this.is('application/x-www-form-urlencoded', 'application/json')) {
      this.request.body = yield body(this);
    } else if (this.is('multipart/form-data')) {
      var part, parts = busboy(this, { autoFields: true });
      while (part = yield parts) {
        part.pipe(fs.createWriteStream(config.path.tmp + '/' + part.filename));
      }
      this.request.body = yield parts.field;
    }
    yield next;
  }
}
