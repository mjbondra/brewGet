
/**
 * Module dependencies
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var CommentSchema = new Schema({
  body: String,
  user: {
    username: String
  }
});

mongoose.model('Comment', CommentSchema);
