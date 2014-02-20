
/**
 * Module dependencies
 */
var cU = require('../../assets/lib/common-utilities')
  , mongoose = require('mongoose')
  , sanitize = require('../../assets/lib/sanitizer-extended')
  , Schema = mongoose.Schema;

var LocationSchema = new Schema(require('../../config/schemas').location);

LocationSchema.index({ 'slug.city': 1, 'slug.state': 1 }, { unique: true });

/**
 * Virtuals
 */
LocationSchema.virtual('address_components')
  .set(function (address_components) {
    this._address_components = address_components;
    var i = address_components.length;
    while (i--) {
      if (address_components[i].types[0] === 'locality') this.city = sanitize.escape(address_components[i].long_name);
      else if (address_components[i].types[0] === 'administrative_area_level_1') this.state = sanitize.escape(address_components[i].short_name);
      else if (address_components[i].types[0] === 'country') this.country = sanitize.escape(address_components[i].long_name);
    }
  })
  .get(function () { 
    return this._address_components; 
  });

/**
 * Pre-save hook
 */
LocationSchema.pre('save', function (next) {
  this.slug.city = cU.slug(this.city);
  this.slug.state = cU.slug(this.state);
  next();
});

mongoose.model('Location', LocationSchema);
