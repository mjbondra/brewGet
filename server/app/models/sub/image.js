
/**
 * Module dependencies
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var ImageSchema = new Schema({
  alt: String,
  class: [ String ],
  fileName: String,
  id: String,
  mimetype: String,
  path: String,
  src: String,
  highDPI: {
    path: String,
    src: String
  },
  raw: {
    path: String,
    src: String
  }
});

mongoose.model('Image', ImageSchema);
