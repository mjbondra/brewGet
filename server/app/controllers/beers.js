
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
  , Beer = mongoose.model('Beer');

/**
 * Mongo projection paramater; includes or excludes fields
 */
var projection = { __v: 0 };

module.exports = {

  /**
   * Autocomplete
   * GET /api/autocomplete/beers/:beer
   */
  autocomplete: function *(next) {
    this.body = yield Promise.promisify(Beer.find, Beer)({ 'aliases.slug': new RegExp(this.params.beer) }, { name: 1, abv: 1, ibu: 1, 'brewery.name': 1, 'brewery.location': 1, 'style.name': 1 });
  },

  /**
   * Index
   * GET /api/beers
   * GET /api/beers/:country
   * GET /api/beers/:country/:state
   * GET /api/beers/:country/:state/:city
   * GET /api/beers/:country/:state/:city/:brewery
   */
  index: function *(next) {
    var query = {};
    if (this.params.country) query['brewery.location.country.slug'] = this.params.country;
    if (this.params.state) query['brewery.location.state.slug'] = this.params.state;
    if (this.params.city) query['brewery.location.city.slug'] = this.params.city;
    if (this.params.brewery) query['brewery.slug'] = this.params.brewery;
    if (this.params.style) query['style.slug'] = this.params.style;
    this.body = yield Promise.promisify(Beer.find, Beer)(query, projection);
  },

  /**
   * Show
   * GET /api/beers/_id/:id
   * GET /api/beers/:country/:state/:city/:brewery/:beer
   */
  show: function *(next) {
    var query = {};
    if (this.params.country) query['brewery.location.country.slug'] = this.params.country;
    if (this.params.state) query['brewery.location.state.slug'] = this.params.state;
    if (this.params.city) query['brewery.location.city.slug'] = this.params.city;
    if (this.params.brewery) query['brewery.slug'] = this.params.brewery;
    if (this.params.beer) query.slug = this.params.beer;
    if (this.params.id) query._id = this.params.id;
    var beer = yield Promise.promisify(Beer.findOne, Beer)(query, projection);
    if (!beer) return yield next; // 404 Not Found
    this.body = beer;
  }
};
