
/**
 * Module dependencies
 */
var cU = require('../../assets/lib/common-utilities')
  , mongoose = require('mongoose')
  , sanitize = require('../../assets/lib/sanitizer-extended')
  , Schema = mongoose.Schema
  , validate = require('../../assets/lib/validator-extended');

var LocationSchema = new Schema(require('../../config/schemas').location);

LocationSchema.index({ 'city.slug': 1, 'state.slug': 1, 'country.slug': 1 }, { unique: true });
LocationSchema.index({ slug: 1 }, { unique: true });

/**
 * Pre-validation hook; Sanitizers
 */
LocationSchema.pre('validate', function (next) {
  if (this.city && this.city.name) this.city.name = sanitize.escape(this.city.name);
  if (this.state) {
    if (this.state.abbreviation) this.state.abbreviation = sanitize.escape(this.state.abbreviation);
    if (this.state.name) this.state.name = sanitize.escape(this.state.name);
  }
  if (this.country) {
    if (this.country.abbreviation) this.country.abbreviation = sanitize.escape(this.country.aabbreviation);
    if (this.country.name) this.country.name = sanitize.escape(this.country.name);
  }
  next();
});

/**
 * Pre-save hook
 */
LocationSchema.pre('save', function (next) {
  this.slug = cU.slug(this.name);
  if (this.city && this.city.name) this.city.slug = cU.slug(this.city.name);
  if (this.state && this.state.abbreviation) this.state.slug = cU.slug(this.state.abbreviation);
  if (this.country && this.country.abbreviation) this.country.slug = cU.slug(this.country.abbreviation);
  next();
});

mongoose.model('Location', LocationSchema);
