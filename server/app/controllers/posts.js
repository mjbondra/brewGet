
/**
 * Module dependencies
 */
var cU = require('../../assets/lib/common-utilities')
  , mongoose = require('mongoose')
  , msg = require('../../config/messages')
  , Q = require('q')
  , _ = require('underscore');

/**
 * Models
 */
var User = mongoose.model('Post');

module.exports = {
  index: function *(next) {},
  show: function *(next) {},
  create: function *(next) {},
  update: function *() {},
  destroy: function *(next) {}
}