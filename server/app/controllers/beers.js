
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
var projection = { _id: 0, __v: 0 };

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
   */
  index: function *(next) {
    this.body = yield Promise.promisify(Beer.find, Beer)({}, projection);
  },

  /**
   * Show
   * GET /api/beers/:brewery/:beer
   */
  show: function *(next) {
    var beer = yield Promise.promisify(Beer.findOne, Beer)({ 'brewery.aliases.slug': this.params.brewery, 'aliases.slug': this.params.beer }, projection);
    if (!beer) return yield next; // 404 Not Found
    this.body = beer;
  },

  breweries: {

    /**
     * Index (by brewery)
     * GET /api/breweries/:brewery/beers
     */
    index: function *(next) {
      this.body = yield Promise.promisify(Beer.find, Beer)({ 'brewery.aliases.slug': this.params.brewery }, projection);
    }
  },

  locations: {

    /**
     * Index (by state)
     * GET /api/locations/:state/beers
     */
    state: function *(next) {
      this.body = yield Promise.promisify(Beer.find, Beer)({ 'brewery._location.slug.state': this.params.state }, projection);
    },

    /**
     * Index (by city)
     * GET /api/locations/:state/:city/beers
     */
    city: function *(next) {
      this.body = yield Promise.promisify(Beer.find, Beer)({ 'brewery._location.slug.state': this.params.state, 'brewery._location.slug.city': this.params.city }, projection);
    }
  },

  styles: {

    /**
     * Index (by style)
     * GET /api/styles/:style/beers
     */
    index: function *(next) {
      this.body = yield Promise.promisify(Beer.find, Beer)({ 'style.aliases.slug': this.params.style }, projection);
    }
  }
}
