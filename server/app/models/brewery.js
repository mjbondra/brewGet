
/**
 * Module dependencies
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var BrewerySchema = new Schema(require('../../assets/lib/schema-definitions').beer.brewery);

mongoose.model('Brewery', BrewerySchema);
