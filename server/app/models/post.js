
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
  var i = this.beers.length
    , beers = []
    , _beers = []
    , newBeers = [];
  while (i--) {
    if (this.beers[i].name && this.beers[i].brewery && this.beers[i].brewery.name) {
      this.beers[i].slug = cU.slug(this.beers[i].name);
      this.beers[i].brewery.slug = cU.slug(this.beers[i].brewery.name);
      beers.push(Promise.promisify(Beer.findOne, Beer)({ slug: this.beers[i].slug, 'brewery.slug': this.beers[i].brewery.slug }));
      _beers.push(this.beers[i]);
    } 
  }
  Promise.all(beers).bind(this).then(function (beers) {
    i = beers.length;
    while (i--) {
      if (!beers[i]) {
        beers[i] = new Beer(_beers[i]);
        newBeers.push(Promise.promisify(beers[i].save, beers[i])());
      }
    }
    this.beers = beers;
    if (newBeers.length > 0) {
      Promise.all(newBeers).then(function (beers) {
        next();
      });
    } else {
      next();
    }
  }).catch(function (err) {
    next();
  });  
});

/**
 * Pre-save hook
 */
PostSchema.pre('save', function (next) {
  this.slug = cU.slug(this.title, true);
  next();
});

mongoose.model('Post', PostSchema);
