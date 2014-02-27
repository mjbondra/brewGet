
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
var Style = mongoose.model('Style');

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
    this.body = yield Promise.promisify(Style.find, Style)({ 'aliases.slug': new RegExp(this.params.style) }, { name: 1 });
  },

  /**
   * Index
   * GET /api/styles
   */
  index: function *(next) {
    this.body = yield Promise.promisify(Style.find, Style)({}, projection);
  },

  /**
   * Show
   * GET /api/styles/:slug
   */
  show: function *(next) {
    var style = yield Promise.promisify(Style.findOne, Style)({ 'aliases.slug': this.params.slug }, projection);
    if (!style) return yield next; // 404 Not Found
    this.body = style;
  }
}
