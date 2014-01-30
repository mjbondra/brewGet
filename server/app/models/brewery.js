
/**
 * Module dependencies
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var BrewerySchema = new Schema(require('../../config/schemas').beer.brewery);

BrewerySchema.index({ slug: 1 }, { unique: true });

mongoose.model('Brewery', BrewerySchema);
