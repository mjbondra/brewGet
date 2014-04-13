
/**
 * Module dependencies
 */
var coBody = require('co-body')
  , cU = require('../../assets/lib/common-utilities')
  , mongoose = require('mongoose')
  , msg = require('../../config/messages')
  , Promise = require('bluebird')
  , _ = require('underscore');

/**
 * Models
 */
var Image = mongoose.model('Image')
  , Brewery = mongoose.model('Brewery');

/**
 * Mongo projection paramater; includes or excludes fields
 */
var projection = { __v: 0 };

module.exports = {

  /**
   * Autocomplete
   * GET /api/autocomplete/breweries/:brewery
   */
  autocomplete: function *(next) {
    this.body = yield Promise.promisify(Brewery.find, Brewery)({ 'aliases.slug': new RegExp(this.params.brewery) }, { name: 1, location: 1 });
  },

  /**
   * Index
   * GET /api/breweries
   * GET /api/breweries/:country
   * GET /api/breweries/:country/:state
   * GET /api/breweries/:country/:state/:city
   */
  index: function *(next) {
    var query = {};
    if (this.params.country) query['location.country.slug'] = this.params.country;
    if (this.params.state) query['location.state.slug'] = this.params.state;
    if (this.params.city) query['location.city.slug'] = this.params.city;
    this.body = yield Promise.promisify(Brewery.find, Brewery)(query, projection);
  },

  /**
   * Show
   * GET /api/breweries/_id/:id
   * GET /api/breweries/:country/:state/:city/:brewery
   */
  show: function *(next) {
    var query = {};
    if (this.params.country) query['location.country.slug'] = this.params.country;
    if (this.params.state) query['location.state.slug'] = this.params.state;
    if (this.params.city) query['location.city.slug'] = this.params.city;
    if (this.params.brewery) query.slug = this.params.brewery;
    if (this.params.id) query._id = this.params.id;
    var brewery = yield Promise.promisify(Brewery.findOne, Brewery)(query, projection);
    if (!brewery) return yield next; // 404 Not Found
    this.body = brewery;
  }
};
