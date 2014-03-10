
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

BrewerySchema.index({ slug: 1, 'location.slug': 1 }, { unique: true });
BrewerySchema.index({ 'aliases.slug': 1, 'location.slug': 1 });
BrewerySchema.index({ 'location.country.slug': 1, 'location.state.slug': 1, 'location.city.slug': 1 });

/**
 * Pre-validation hook; Sanitizers
 */
BrewerySchema.pre('validate', function (next) {
  this.processNest(next, 2);
});

/**
 * Pre-save hook
 */
BrewerySchema.pre('save', function (next) {
  this.slug = cU.slug(this.name);
  if (this.isNew) this.aliases.push({ name: this.name, slug: this.slug });

  next();
});

BrewerySchema.methods = {

  /**
   * Process location against the location model; retreive existing, save new
   *
   * Locations may be plain strings, or stringified Google Places API objects
   *
   * @param {function} next - function that calls next function
   * @param {number} limit - number of times the function can be called again to correct for async uniqueness errors
   * @param {number} [count=0] - number of times the function has been called
   */
  processNest: function (next, limit, count) {
    if (!count) count = 1;
    else count++;

    if (typeof this._doc.location === 'string') this.location = {
      name: this._doc.location
    };
    if (!this.location.name) {
      this.location = {};
      return next();
    }

    Promise.promisify(Location.findOne, Location)({ slug: cU.slug(this.location.name) }).bind(this).then(function (location) {
      if (location) return location;
      location = new Location(this._doc.location);
      if (!location.country.abbreviation || !location.state.abbreviation || !location.city.name) return {
        name: sanitize.escape(location.name),
        slug: cU.slug(sanitize.escape(location.name))
      };
      return Promise.promisify(location.save, location)();
    }).then(function (location) {
      if (location[0]) location = location[0];
      this.location = location;
      next();
    }).catch(function (err) {
      if (err.name === 'RejectionError' && err.cause) err = err.cause;
      // pass error to next() if limit has been reached, or if the error is not an async-caused duplicate key error
      if (count >= limit || ( err.code !== 11000 && err.code !== 11001 )) return next(err);
      this.processNest(next, limit, count);
    });
  }
};

mongoose.model('Brewery', BrewerySchema);
