
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
  next();
});

/**
 * Pre-save hook
 */
PostSchema.pre('save', function (next) {
  this.slug = cU.slug(this.title, true);

  // process validated beers against beer model; retreive existing, save new
  var i = this.beers.length
    , beers = [];
  while (i--) {
    beers.push(Promise.promisify(Beer.findOne, Beer)({ 
      slug: cU.slug(this.beers[i].name),
      'brewery.slug': cU.slug(this.beers[i].brewery.name)
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
    next();
  });

});

mongoose.model('Post', PostSchema);
