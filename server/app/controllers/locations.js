
/**
 * Module dependencies
 */
var cU = require('../../assets/lib/common-utilities')
  , mongoose = require('mongoose')
  , Q = require('q');

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
   */
  index: function *(next) {
    this.body = yield Q.ninvoke(Location, 'find', {}, projection);
  },

  /**
   * Show state
   * GET /api/locations/:state
   */
  state: function *(next) {
    var state = yield Q.ninvoke(Location, 'find', { 'slug.state': this.params.state }, projection);
    if (!state.length) return yield next; // 404 Not Found
    this.body = state;
  },

  /**
   * Show city
   * GET /api/locations/:state/:city
   */
  city: function *(next) {
    var city = yield Q.ninvoke(Location, 'findOne', { 'slug.state': this.params.state, 'slug.city': this.params.city }, projection);
    if (!city) return yield next; // 404 Not Found
    this.body = city;
  }
}
