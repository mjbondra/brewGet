
/**
 * Module dependencies
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var StyleSchema = new Schema(require('../../config/schemas').beer.style);

StyleSchema.index({ slug: 1 }, { unique: true });
StyleSchema.index({ 'aliases.slug': 1 }, { unique: true });

mongoose.model('Style', StyleSchema);
