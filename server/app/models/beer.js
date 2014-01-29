
/**
 * Module dependencies
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var BeerSchema = new Schema(require('../../assets/lib/schema-definitions').beer);

BeerSchema.index({ slug: 1, 'brewery.slug': 1 }, { unique: true });

mongoose.model('Beer', BeerSchema);
