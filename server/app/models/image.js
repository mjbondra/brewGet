
/**
 * Module dependencies
 */
var coBusboy = require('co-busboy')
  , coFs = require('co-fs')
  , config = require('../../config/config')[process.env.NODE_ENV || 'development']
  , fs = require('fs')
  , gm = require('gm')
  , mime = require('mime')
  , mongoose = require('mongoose')
  , Q = require('q')
  , Schema = mongoose.Schema
  , uid = require('uid2');

var ImageSchema = new Schema({
  alt: String,
  class: [ String ],
  encoding: String,
  filename: String,
  height: Number,
  id: String,
  mimetype: String,
  path: String,
  size: Number,
  src: String,
  width: Number
});

ImageSchema.methods = {

  resize: function *() {},

  /**
   * Handler for form data containing an image
   * ! LIMITED TO SINGLE IMAGE UPLOADS !
   *
   * @param   {object}  ctx   -   koa context object
   * @param   {object}  opts
   */
  stream: function *(ctx, opts) {
    opts = opts || {};
    opts.subdir = opts.subdir || '';
    opts.limits = opts.limits || {};
    opts.limits.files = 1;
    opts.limits.fileSize = opts.limits.fileSize || 2097152 // 2 MB;
  
    var parts = coBusboy(ctx, opts);

    var dir = config.path.upload + ( opts.subdir ? '/' + opts.subdir : '' )
      , filename = new Date().valueOf() + '-' + uid(6)
      , path = dir + '/' + filename + '.jpg'
      , types = [ 'image/png', 'image/jpeg', 'image/gif' ]
      , size = Q.defer();

    while (part = yield parts) {
      if (!part.length) {
        if (part.mime === 'application/octet-stream' && part.filename) part.mime = mime.lookup(part.filename);

        part.on('limit', function () {
          fs.unlink(path);
        });

        gm(part)
          .resize('400', '400')
          .strip()
          .stream('jpeg', function (err, stdout, stderr) {
            var writeStream = fs.createWriteStream(path);

            stdout.on('end', function () {
              size.resolve(this.bytesRead);
            });

            stdout.pipe(writeStream);
          });
      }
    }

    this.size = yield size.promise;
  }
}

mongoose.model('Image', ImageSchema);
