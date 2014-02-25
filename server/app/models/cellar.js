
/**
 * Module dependencies
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var CellarSchema = new Schema({
  body: String,
  user: {
    username: String,
    slug: {
      index: { unique: true },
      type: String
    }
  }
});

mongoose.model('Cellar', CellarSchema);
