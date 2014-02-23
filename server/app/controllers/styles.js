
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
   * Index
   * GET /api/styles
   */
  index: function *(next) {
    this.body = yield Promise.promisify(Style.find, Style)({}, projection);
  }
}
