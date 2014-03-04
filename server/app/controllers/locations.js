
/**
 * Module dependencies
 */
var cU = require('../../assets/lib/common-utilities')
  , mongoose = require('mongoose')
  , Promise = require('bluebird');

/**
 * Models
 */
var Location = mongoose.model('Location');

/**
 * Mongo projection paramater; includes or excludes fields
 */
var projection = { _id: 0, __v: 0 };

module.exports = {

  /**
   * Index
   * GET /api/locations
   * GET /api/locations/:state
   */
  index: function *(next) {
    var locations = yield Promise.promisify(Location.find, Location)(this.params.state ? { 'slug.state': this.params.state } : {}, projection);
    if (!locations.length) return yield next; // 404 Not Found
    this.body = locations;
  },

  /**
   * Show city
   * GET /api/locations/:state/:city
   */
  show: function *(next) {
    var city = yield Promise.promisify(Location.findOne, Location)({ 'slug.state': this.params.state, 'slug.city': this.params.city }, projection);
    if (!city) return yield next; // 404 Not Found
    this.body = city;
  }
}
