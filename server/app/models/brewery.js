
/**
 * Module dependencies
 */
var mongoose = require('mongoose')
  , Promise = require('bluebird')
  , Schema = mongoose.Schema;

var BrewerySchema = new Schema(require('../../config/schemas').beer.brewery)
  , Location = mongoose.model('Location');

BrewerySchema.index({ slug: 1 }, { unique: true });

/**
 * Pre-validation hook; Sanitizers
 */
BrewerySchema.pre('validate', function (next) {
  // parse location strings -- they may be plain strings, or stringified Google Places API objects
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
  next();
});

mongoose.model('Brewery', BrewerySchema);
