
/**
 * Module dependencies
 */
var body = require('co-body')
  , busboy = require('co-busboy')
  , coFs = require('co-fs')
  , ffObj = require('../../assets/lib/form-field-objectify')
  , fs = require('fs')
  , uid = require('uid2');

module.exports = function (opts) {
  opts = opts || {};
  opts.uploadDir = opts.uploadDir || '/tmp'; 
  return function *(next) {

    // json and url-encoded data
    if (this.is('application/x-www-form-urlencoded', 'application/json')) {
      this.request.body = yield body(this);
      yield next;

    // multi-part form data
    } else if (this.is('multipart/form-data')) {
      var body = ffObj.create()
        , files = ffObj.create()
        , parts = busboy(this)
        , uploadPaths = [];

      var part;
      while (part = yield parts) {
        if (part.length) yield body.addField(part[0], part[1]);
        else {
          var path = opts.uploadDir + '/' + uid(15);
          part.pipe(fs.createWriteStream(path));
          uploadPaths.push(path);
          yield files.addField(part.fieldname, part, { object: true });
        } 
      }
      this.request.body = yield body.getFields();
      this.request.files = yield files.getFields();
      console.log('body', this.request.body);
      console.log('files', this.request.files);
      yield next;
      
      // remove temporary files
      var i = uploadPaths.length;
      while (i--) {
        yield coFs.unlink(uploadPaths[i]);
      }

    // nothing to process
    } else yield next;
  }
}
