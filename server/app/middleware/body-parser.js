
/**
 * Module dependencies
 */
var coBody = require('co-body')
  , coBusboy = require('../../assets/lib/co-busboy') // temporarily hijacking this module to add event listeners that rely on an unpublished version of busboy
  , coFs = require('co-fs')
  , ffObj = require('../../assets/lib/form-field-objectify')
  , fs = require('fs')
  , uid = require('uid2');


/**
 * Opinionated body-parsing middleware for Koa that augments Koa's ctx.request object
 * - uses 'co-body' for json and url-encoded data
 * - uses 'co-busboy' for multi-part data
 *
 * ctx.request.body - contains parsed request body
 * ctx.request.files - contains parsed request files
 *
 * @param opts {object} - object containing options for middleware
 * @param opts.busboy {object} - busboy options (see busboy documentation for more details)
 * @param opts.types {array} - array of acceptable mime-types {string} for file uploads (defaults to allowing all types)
 * @param opts.uploadDir {string} - directory where files will be uploaded (note: they will be deleted just prior to response)
 */
module.exports = function (opts) {
  opts = opts || {};
  opts.busboy = opts.busboy || {};
  opts.types = opts.types || [];
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
        , tmpPaths = [];

      while (part = yield parts) {

        // field
        if (part.length) yield body.addField(part[0], part[1]);

        // file
        else {

          var path = null;

          // pipe acceptable mime-type to temporary upload directory
          if (opts.types.indexOf(part.mime) >= 0 || opts.types.length === 0) {
            path = opts.uploadDir + '/' + uid(15);

            // file stream and file stream events
            part.on('limit', function () {
              var re = new RegExp(this.fieldname.replace('[', '\\[').replace(']', '\\]') + '\\[path\\]' + '.*?(&|$)');
              files._fieldStr = files._fieldStr.replace(re, '').replace(/&$/, '') + '&' + this.fieldname + '[error]=maximum file size was exceeded';
            });
            part.on('end', function () {
              if (this.fieldname && this._readableState && this._readableState.pipes) {
                var bytesWritten = ( this._readableState.pipes.bytesWritten ? this._readableState.pipes.bytesWritten : 0 ) + ( this._readableState.pipes._writableState && this._readableState.pipes._writableState.length ? this._readableState.pipes._writableState.length : 0 );
                files._fieldStr = ( files._fieldStr ? files._fieldStr + '&' : '' ) + this.fieldname + '[size]=' + bytesWritten;
              }
            });

            part.pipe(fs.createWriteStream(path));
            tmpPaths.push(path);  

          // skip unacceptable mime-type
          } else {

            // prevent stalling
            part.resume();
            part.error = ( part.filename ? 'mime-type not acceptable' : 'empty file' );
          }
          
          yield files.addField(part.fieldname, {
            encoding: part.encoding,
            error: part.error,
            filename: part.filename,
            mimetype: part.mime,
            path: path
          });
        } 
      }

      this.request.body = this.req.body = yield body.getFields();
      this.request.files = this.req.files = yield files.getFields();
      console.log(this.request.files);
      yield next;
      
      // remove temporary files
      var i = tmpPaths.length;
      while (i--) {
        yield coFs.unlink(tmpPaths[i]);
      }
      
    // nothing to process
    } else yield next;
  }
}
