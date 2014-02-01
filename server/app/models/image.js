
/**
 * Module dependencies
 */
var coFs = require('co-fs')
  , config = require('../../config/config')[process.env.NODE_ENV || 'development']
  , fs = require('fs')
  , gm = require('gm')
  , mime = require('mime')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , uid = require('uid2');

var ImageSchema = new Schema({
  alt: String,
  class: [ String ],
  encoding: String,
  filename: String,
  id: String,
  mimetype: String,
  path: String,
  size: Number
});

ImageSchema.methods = {

  resize: function *() {},

  /**
   * Handler for busboy parsed form data containing an image
   * ! ASSUMES STREAM CONTAINS SINGLE IMAGE !
   *
   * @param   {object}  parts   -   co-busboy parsed object
   * @param   {object}  opts
   */
  stream: function *(parts, opts) {
    opts = opts || {};
    opts.subdir = opts.subdir || '';

    var dir = config.path.upload + ( opts.subdir ? '/' + opts.subdir : '' )
      , filename = new Date().valueOf() + '-' + uid(6);

    var path = dir + '/' + filename + '.png';
    while (part = yield parts) {
      if (!part.length) {
        part.on('limit', function () {
          fs.unlink(path);
        });
        gm(part)
          .resize('200', '200')
          .strip()
          .stream(function (err, stdout, stderr) {
            var writeStream = fs.createWriteStream(path);
            stdout.pipe(writeStream);
          });
      }
    }
  }
}

mongoose.model('Image', ImageSchema);
