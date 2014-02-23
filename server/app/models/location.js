
/**
 * Module dependencies
 */
var cU = require('../../assets/lib/common-utilities')
  , mongoose = require('mongoose')
  , sanitize = require('../../assets/lib/sanitizer-extended')
  , Schema = mongoose.Schema
  , _ = require('underscore')
  , validate = require('../../assets/lib/validator-extended');

var LocationSchema = new Schema(require('../../config/schemas').location);

LocationSchema.index({ 'slug.city': 1, 'slug.state': 1 }, { unique: true });

/**
 * Virtuals
 */
LocationSchema.virtual('address_components').set(function (address_components) {
  this._address_components = address_components;
  var i = address_components.length;
  while (i--) {
    if (address_components[i].types[0] === 'locality') {
      this.city = sanitize.escape(address_components[i].long_name);
      this.slug.city = cU.slug(this.city);
    }
    else if (address_components[i].types[0] === 'administrative_area_level_1') {
      this.state = sanitize.escape(address_components[i].short_name);
      this.slug.state = cU.slug(this.state);
    }
    else if (address_components[i].types[0] === 'country') this.country = sanitize.escape(address_components[i].long_name);
  }
}).get(function () { 
  return this._address_components; 
});

LocationSchema.virtual('raw').set(function (raw) {
  try {
    raw = JSON.parse(raw);
    this._raw = raw;
    this.address_components = raw.address_components;
    this.formatted_address = sanitize.escape(raw.formatted_address);
  } catch (err) {
    this._raw = raw;
  }
}).get(function () {
  return this._raw;
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
