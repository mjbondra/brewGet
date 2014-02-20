
/**
 * Module dependencies
 */
var cU = require('../../assets/lib/common-utilities')
  , mongoose = require('mongoose')
  , msg = require('../../config/messages')
  , Promise = require('bluebird')
  , sanitize = require('../../assets/lib/sanitizer-extended')
  , Schema = mongoose.Schema
  , validate = require('../../assets/lib/validator-extended');

/**
 * Schema dependencies; subdocuments
 */
var ImageSchema = mongoose.model('Image').schema
  , Beer = mongoose.model('Beer')
  , BeerSchema = Beer.schema
  , CommentSchema = mongoose.model('Comment').schema;

BeerSchema.date = Date;
BeerSchema.year = String;

/**
 * Post schema
 */
var PostSchema = new Schema({
  beers: [ BeerSchema ],
  body: String,
  category: {
    index: true,
    type: String,
    validate: [ 
      { validator: validate.notNull, msg: msg.category.isNull }
    ]
  },
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
  if (!this.category && this.isNew) this.category = null;
  var i = this.beers.length;
  while (i--) {
    console.log(this.beers[i]);
  }
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
