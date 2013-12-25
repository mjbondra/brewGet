
/**
 * Module dependencies
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

/**
 * Error schema
 */
var ErrorSchema = new Schema({
  method: String,
  params: Object,
  referer: String,
  stack: String,
  status: Number,
  url: String,
  user: { 
    type : Schema.ObjectId, 
    ref : 'User' 
  },
  userIP: String
});

mongoose.model('Error', ErrorSchema);
