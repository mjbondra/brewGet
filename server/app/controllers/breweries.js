
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
var projection = { _id: 0, __v: 0 };

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
   */
  index: function *(next) {
    this.body = yield Promise.promisify(Brewery.find, Brewery)({}, projection);
  },

  /**
   * Show
   * GET /api/users/:slug
   */
   show: function *(next) {
      var brewery = yield Promise.promisify(Brewery.findOne, Brewery)({ 'aliases.slug': this.params.slug }, projection);
      if (!brewery) return yield next; // 404 Not Found
      this.body = brewery;
   }
}
