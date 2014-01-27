
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
  , BeerSchema = require('../../assets/lib/schema-definitions').beer;

/**
 * Post schema
 */
var PostSchema = new Schema({
  beer: BeerSchema,
  images: [ ImageSchema ],
  type: String,
  user: {
    username: String
  }
});

mongoose.model('Post', PostSchema);
