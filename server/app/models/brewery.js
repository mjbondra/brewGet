
/**
 * Module dependencies
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var BrewerySchema = new Schema(require('../../assets/lib/schema-definitions').beer.brewery);

BrewerySchema.index({ slug: 1 }, { unique: true });

mongoose.model('Brewery', BrewerySchema);
