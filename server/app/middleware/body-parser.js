
/**
 * Module dependencies
 */
var coBody = require('co-body')
  , coBusboy = require('co-busboy')
  , coFs = require('co-fs')
  , ffObj = require('../../assets/lib/form-field-objectify')
  , fs = require('fs')
  , uid = require('uid2');

module.exports = function (opts) {
  opts = opts || {};
  opts.busboy = opts.busboy || {};
  opts.uploadDir = opts.uploadDir || '/tmp'; 
  return function *(next) {

    // json and url-encoded data
    if (this.is('application/x-www-form-urlencoded', 'application/json')) {
      this.request.body = yield coBody(this);
      yield next;

    // multi-part form data
    } else if (this.is('multipart/form-data')) {

      var body = ffObj.create()
        , files = ffObj.create()
        , parts = coBusboy(this, opts.busboy)
        , uploadPaths = [];

      while (part = yield parts) {
        if (part.length) yield body.addField(part[0], part[1]);
        else {
          var path = opts.uploadDir + '/' + uid(15);

          // pipe and pipe events
          part.on('limit', function () {
            var re = new RegExp(this.fieldname.replace('[', '\\[').replace(']', '\\]') + '.*?(&|$)', 'g');
            files._fieldStr = files._fieldStr.replace(re, '').replace(/&$/, '');
          });
          part.on('end', function () {
            if (this.fieldname && this._readableState && this._readableState.pipes) {
              var bytesWritten = ( this._readableState.pipes.bytesWritten ? this._readableState.pipes.bytesWritten : 0 ) + ( this._readableState.pipes._writableState && this._readableState.pipes._writableState.length ? this._readableState.pipes._writableState.length : 0 );
              files._fieldStr = ( files._fieldStr ? files._fieldStr + '&' : '' ) + this.fieldname + '[size]=' + bytesWritten;
            }
          });
          part.pipe(fs.createWriteStream(path));

          uploadPaths.push(path);
          yield files.addField(part.fieldname, {
            encoding: part.encoding || part.transferEncoding,
            name: part.filename,
            path: path,
            type: part.mime || part.mimeType
          });
        } 
      }
      this.request.body = yield body.getFields();
      this.request.files = yield files.getFields();
      console.log(this.request.files);
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
