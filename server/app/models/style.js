
/**
 * Module dependencies
 */
var cU = require('../../assets/lib/common-utilities')
  , mongoose = require('mongoose')
  , sanitize = require('../../assets/lib/sanitizer-extended')
  , Schema = mongoose.Schema;

var StyleSchema = new Schema(require('../../config/schemas').beer.style);

StyleSchema.index({ slug: 1 }, { unique: true });
StyleSchema.index({ 'aliases.slug': 1 }, { unique: true });

/**
 * Pre-save hook
 */
StyleSchema.pre('save', function (next) {
  this.slug = cU.slug(this.name);
  if (this.isNew) this.aliases.push({ name: this.name, slug: this.slug });
  
  next();
});

mongoose.model('Style', StyleSchema);
