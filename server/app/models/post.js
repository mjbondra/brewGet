
/**
 * Module dependencies
 */
var cU = require('../../assets/lib/common-utilities')
  , mongoose = require('mongoose')
  , msg = require('../../config/messages')
  , sanitize = require('../../assets/lib/sanitizer-extended')
  , Schema = mongoose.Schema
  , validate = require('../../assets/lib/validator-extended');

/**
 * Schema dependencies; subdocuments
 */
var ImageSchema = mongoose.model('Image').Schema
  , BeerSchema = mongoose.model('Beer').Schema
  , CommentSchema = mongoose.model('Comment').Schema;

/**
 * Post schema
 */
var PostSchema = new Schema({
  comments: [ CommentSchema ],
  ft: [ BeerSchema ],
  images: [ ImageSchema ],
  iso: [ BeerSchema ],
  slug: {
    index: true,
    type: String
  },
  type: String,
  user: {
    username: String
  }
});

mongoose.model('Post', PostSchema);
