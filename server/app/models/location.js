
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

LocationSchema.index({ 'city.slug': 1, 'state.slug': 1 }, { unique: true });

/**
 * Virtuals
 */
LocationSchema.virtual('address_components').set(function (address_components) {
  this._address_components = address_components;
  var i = address_components.length;
  while (i--) {
    if (address_components[i].types[0] === 'locality') {
      this.city = {};
      this.city.name = sanitize.escape(address_components[i].long_name);
      this.city.slug = cU.slug(this.city.name);
    }
    else if (address_components[i].types[0] === 'administrative_area_level_1') {
      this.state = {};
      this.state.abbreviation = sanitize.escape(address_components[i].short_name);
      this.state.name = sanitize.escape(address_components[i].long_name);
      this.state.slug = cU.slug(this.state.abbreviation);
    }
    else if (address_components[i].types[0] === 'country') {
      this.country = {};
      this.country.abbreviation = sanitize.escape(address_components[i].short_name);
      this.country.name = sanitize.escape(address_components[i].long_name);
      this.country.slug = cU.slug(this.country.abbreviation);
    }
  }
}).get(function () { 
  return this._address_components; 
});

LocationSchema.virtual('raw').set(function (raw) {
  try {
    raw = JSON.parse(raw);
    this._raw = raw;

    // latitude & longitude
    if (raw.geometry) this.geometry = raw.geometry;

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
  if (this.city && this.city.name && !this.city.slug) this.city.slug = cU.slug(this.city.name);
  if (this.state && this.state.abbreviation && !this.state.slug) this.state.slug = cU.slug(this.state.abbreviation);
  if (this.country && this.country.abbreviation && !this.country.slug) this.country.slug = cU.slug(this.country.abbreviation);
  next();
});

mongoose.model('Location', LocationSchema);
