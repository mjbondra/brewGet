
/**
 * Module dependencies
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var BeerSchema = new Schema(require('../../config/schemas').beer)
  , Brewery = mongoose.model('Brewery');

BeerSchema.index({ slug: 1, 'brewery.slug': 1 }, { unique: true });

/**
 * Pre-validation hook; Sanitizers
 */
BeerSchema.pre('validate', function (next) {
  next();
});

/**
 * Pre-save hook
 */
BeerSchema.pre('save', function (next) {
  next();
});

mongoose.model('Beer', BeerSchema);
