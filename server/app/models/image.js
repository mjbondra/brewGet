
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
  , msg = require('../../config/messages')
  , Q = require('q')
  , Schema = mongoose.Schema
  , uid = require('uid2');

/**
 * Custom error type
 */
var ImageError = function (message) {
  this.name = 'ImageError';
  this.message = (message || '');
}
ImageError.prototype = Error.prototype;

/**
 * Image schema
 */
var ImageSchema = new Schema({
  alt: String,
  class: [ String ],
  encoding: String,
  filename: String,
  geometry: {
    height: Number,
    width: Number
  },
  mimetype: String,
  path: String,
  size: Number,
  src: String
});

/**
 * Image methods
 */
ImageSchema.methods = {
  destroy: function *(image) {
    if (image.path) {
      var exists = yield coFs.exists(image.path);
      if (exists) yield coFs.unlink(image.path);
    }
  },

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
    opts.alt = opts.alt || 'image';
    opts.crop = opts.crop || false;
    opts.width = opts.width || '400';
    opts.height = opts.height || '400';
    opts.subdir = opts.subdir || '';
    opts.limits = opts.limits || {};
    opts.limits.files = 1;
    opts.limits.fileSize = opts.limits.fileSize || 2097152 // 2 MB;
  
    var parts = coBusboy(ctx, { limits: opts.limits });

    var dir = config.path.upload + ( opts.subdir ? '/' + opts.subdir : '' )
      , geometry = ( opts.crop === true ? { height: opts.height, width: opts.width } : Q.defer() )
      , limitExceeded = false
      , size = Q.defer()
      , types = [ 'image/png', 'image/jpeg', 'image/gif' ];
    
    var encoding, filename, mimetype, path;

    // reusable callback for graphicsmagick
    var gmCallback = function (err, stdout, stderr) {
      var writeStream = fs.createWriteStream(path);
      stdout.on('error', function (err) {
        if (path) fs.unlink(path);
        size.reject(new Error(err));
      });
      stdout.on('end', function () {
        size.resolve(this.bytesRead);
        if (opts.crop === false && limitExceeded === false) {
          var readStream = fs.createReadStream(path);
          gm(readStream).size({ buffer: true }, function (err, size) {
            if (err) {
              fs.unlink(path);
              geometry.reject(new Error(err));
            } else {
              geometry.resolve(size);
            }
          });
        }
      });
      stdout.pipe(writeStream);
    }

    while (part = yield parts) {
      if (!part.length) {
        if (part.mime === 'application/octet-stream' && part.filename) part.mime = mime.lookup(part.filename);

        if (types.indexOf(part.mime) >= 0) {
          var extension = mime.extension(part.mime);

          encoding = part.encoding;
          filename = new Date().valueOf() + '-' + uid(6) + '.' + ( extension === 'jpeg' ? 'jpg' : extension );
          mimetype = part.mime;
          path = dir + '/' + filename;

          part.on('limit', function () {
            limitExceeded = true;
            fs.unlink(path);
          });

          if (opts.crop === true) {
            gm(part)
              .resize(opts.width, opts.height, '^')
              .gravity('Center')
              .crop(opts.width, opts.height)
              .strip()
              .stream(gmCallback);
          } else {
            gm(part)
              .resize(opts.width, opts.height)
              .strip()
              .stream(gmCallback);
          }
        } else {
          part.resume();
          throw new ImageError(msg.image.mimeError(part.mime));
        }
      }
    }

    // validation
    if (limitExceeded === true) throw new ImageError(msg.image.exceedsFileSize(opts.limits.fileSize));

    this.alt = opts.alt;
    this.encoding = encoding;
    this.filename = filename;
    this.mimetype = mimetype;
    this.path = path;
    this.src = '/assets/img/' + ( opts.subdir ? opts.subdir + '/' : '' ) + filename;

    // (potentially) promised values
    this.size = yield size.promise;
    if (!this.size || this.size === 0) {
      if (path) {
        var exists = yield coFs.exists(path);
        if (exists) yield coFs.unlink(path);
      }
      throw new ImageError(msg.image.unknownError);
    }

    this.geometry = ( typeof geometry.promise !== 'undefined' ? yield geometry.promise : geometry );
  }
}

mongoose.model('Image', ImageSchema);
