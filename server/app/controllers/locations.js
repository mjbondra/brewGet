
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
    var query = {};
    if (this.params.country) query['country.slug'] = this.params.country;
    if (this.params.state) query['state.slug'] = this.params.state;
    this.body = yield Promise.promisify(Location.find, Location)(query, projection);
  },

  /**
   * Show city
   * GET /api/locations/:state/:city
   */
  show: function *(next) {
    var query = {};
    if (this.params.country) query['country.slug'] = this.params.country;
    if (this.params.state) query['state.slug'] = this.params.state;
    if (this.params.city) query['city.slug'] = this.params.city;
    if (this.params.id) query._id = this.params.id;
    var location = yield Promise.promisify(Location.findOne, Location)(query, projection);
    if (!location) return yield next; // 404 Not Found
    this.body = location;
  }
};
