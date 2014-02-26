
/**
 * Module dependencies
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var MessageSchema = new Schema({
  body: String,
  user: {
    username: String,
    slug: {
      index: true,
      type: String
    }
  }
});

mongoose.model('Message', MessageSchema);
