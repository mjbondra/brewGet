
/**
 * Module dependencies
 */
var cU = require('../../assets/lib/common-utilities')
  , mongoose = require('mongoose')
  , msg = require('../../config/messages')
  , Promise = require('bluebird')
  , sanitize = require('../../assets/lib/sanitizer-extended')
  , Schema = mongoose.Schema
  , validate = require('../../assets/lib/validator-extended')
  , _ = require('underscore');

/**
 * Schema dependencies; subdocuments
 */
var ImageSchema = mongoose.model('Image').schema
  , Beer = mongoose.model('Beer')
  , BeerSchema = require('../../config/schemas').beer
  , CommentSchema = mongoose.model('Comment').schema;

BeerSchema.date = Date;
BeerSchema.year = Number;

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
  this.processNest(next, this.beers.length);
});

/**
 * Pre-save hook
 */
PostSchema.pre('save', function (next) {
  this.slug = cU.slug(this.title, true);
  next();
});

/**
 * Methods 
 */
PostSchema.methods = {
  
  /**
   * Process beers against beer model; retreive existing, save new
   *
   * @param {function} next - function that calls next function
   * @param {number} limit - number of times the function can be called again to correct for async uniqueness errors
   * @param {number} [count=0] - number of times the function has been called
   */
  processNest: function (next, limit, count) {
    if (!count) count = 1;
    else count++;

    var i = this.beers.length
      , beers = [];
    while (i--) {
      beers.push(Promise.promisify(Beer.findOne, Beer)({ 
        'aliases.slug': cU.slug(this.beers[i].name),
        'brewery.aliases.slug': cU.slug(this.beers[i].brewery.name)
      }));
    }
    Promise.all(beers).bind(this).then(function (beers) {
      i = beers.length;
      while (i--) {
        if (!beers[i]) {
          beers[i] = new Beer(this._doc.beers[beers.length - (i + 1)]);
          beers[i] = Promise.promisify(beers[i].save, beers[i])();
        }
      }
      return Promise.all(beers);
    }).then(function (beers) {
      i = beers.length;
      while (i--) {
        if (beers[i][0]) beers[i] = beers[i][0];
        this.beers[beers.length - (i + 1)] = beers[i];
      }
      next();
    }).catch(function (err) {
      if (err.name === 'RejectionError' && err.cause) err = err.cause;
      // pass error to next() if limit has been reached, or if the error is not an async-caused duplicate key error
      if (count >= limit || ( err.code !== 11000 && err.code !== 11001 )) return next(err);
      this.processNest(next, limit, count);
    });
  }
};

mongoose.model('Post', PostSchema);
