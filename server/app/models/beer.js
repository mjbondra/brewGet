
/**
 * Module dependencies
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var BeerSchema = new Schema(require('../../config/schemas').beer);

BeerSchema.index({ slug: 1, 'brewery.slug': 1 }, { unique: true });

mongoose.model('Beer', BeerSchema);
