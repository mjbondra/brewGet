
/**
 * Module dependencies
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var BeerSchema = new Schema(require('../../assets/lib/schema-definitions').beer);

mongoose.model('Beer', BeerSchema);
