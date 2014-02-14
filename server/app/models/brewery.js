
/**
 * Module dependencies
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var BrewerySchema = new Schema(require('../../config/schemas').beer.brewery)
  , Location = mongoose.model('Location');

BrewerySchema.index({ slug: 1 }, { unique: true });

/**
 * Pre-validation hook; Sanitizers
 */
BrewerySchema.pre('validate', function (next) {
  next();
});

/**
 * Pre-save hook
 */
BrewerySchema.pre('save', function (next) {
  next();
});

mongoose.model('Brewery', BrewerySchema);
