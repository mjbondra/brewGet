
/**
 * Module dependencies
 */
var mongoose = require('mongoose')
  , msg = require('../../config/messages')
  , Q = require('q')
  , _ = require('underscore');

/**
 * Models
 */
var User = mongoose.model('User');

/**
 * Index
 * GET /users
 */
exports.index = function (req, res, next) {
  Q.ninvoke(User, 'find')
    .then(function (users) {
      res.json(users);
    })
    .fail(function (err) {
      next(err);
    });
}

/**
 * Create
 * POST /users/new 
 */
exports.create = function (req, res, next) {
  var user = new User(req.body);
  Q.ninvoke(user, 'save')
    .then(function () {
      newContentResponse('user', user, msg.user.created(user.username));
    })
    .fail(function (err) {
      next(err);
    });
}
