
/**
 * Module dependencies
 */
var cU = require('../../assets/lib/common-utilities')
  , mongoose = require('mongoose')
  , msg = require('../../config/messages')
  , Q = require('q')
  , sanitize = require('../../assets/lib/sanitizer-extended')
  , Schema = mongoose.Schema
  , validate = require('../../assets/lib/validator-extended');

/**
 * Schema dependencies; subdocuments
 */
var ImageSchema = mongoose.model('Image').Schema
  , Beer = mongoose.model('Beer')
  , BeerSchema = Beer.Schema
  , CommentSchema = mongoose.model('Comment').Schema;

/**
 * Post schema
 */
var PostSchema = new Schema({
  beer: [ BeerSchema ],
  body: String,
  category: String,
  comments: [ CommentSchema ],
  images: [ ImageSchema ],
  slug: {
    index: true,
    type: String
  },
  title: String,
  type: String,
  user: {
    username: String,
    slug: {
      index: true,
      type: String
    }
  }
});

/**
 * Pre-validation hook; Sanitizers
 */
PostSchema.pre('validate', function (next) {
  next();
});

/**
 * Pre-save hook
 */
PostSchema.pre('save', function (next) {
  this.slug = cU.slug(this.title, true);
  next();
});

mongoose.model('Post', PostSchema);
