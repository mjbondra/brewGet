
/**
 * Module dependencies
 */
var cU = require('../../assets/lib/common-utilities')
  , mongoose = require('mongoose')
  , Promise = require('bluebird')
  , sanitize = require('../../assets/lib/sanitizer-extended')
  , Schema = mongoose.Schema;

var BrewerySchema = new Schema(require('../../config/schemas').beer.brewery)
  , Location = mongoose.model('Location');

BrewerySchema.index({ slug: 1 }, { unique: true });
BrewerySchema.index({ 'aliases.slug': 1 }, { unique: true });

/**
 * Pre-validation hook; Sanitizers
 */
BrewerySchema.pre('validate', function (next) {
  // parse location strings before validation -- they may be plain strings, or stringified Google Places API objects
  try {
    var location = new Location(JSON.parse(this.location));
    this._location = location;
    this.location = location.formatted_address;
    Promise.promisify(location.save, location)().then(function () {
      next();
    }).catch(function (err) {
      next();
    });
  } catch (err) {
    if (typeof this.location === 'string') this.location = sanitize.escape(this.location);
    else this.location = '';
    this._location = {};
    next();
  }
});

/**
 * Pre-save hook
 */
BrewerySchema.pre('save', function (next) {
  this.slug = cU.slug(this.name);
  if (this.isNew) this.aliases.push({ name: this.name, slug: this.slug });

  next();
});

mongoose.model('Brewery', BrewerySchema);
