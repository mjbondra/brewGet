
/**
 * Module dependencies
 */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var LocationSchema = new Schema(require('../../assets/lib/schema-definitions').location);

LocationSchema.index({ 'slug.city': 1, 'slug.state': 1 }, { unique: true });

LocationSchema.methods = {
  parse: function (location) {}
}

mongoose.model('Location', LocationSchema);
