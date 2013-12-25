
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
 * GET /api/users
 */
exports.index = function *(next) {
  try {
    var users = yield Q.ninvoke(User, 'find');
    this.body = yield censor(users);
  } catch (err) {
    this.err = err;
    yield next;
  }
}

/**
 * Create
 * POST /api/users/new 
 */
exports.create = function *(next) {
  try {
    var user = new User(this.request.body);
    yield Q.ninvoke(user, 'save');
    this.status = 201; // 201 Created
    this.body = yield resCreated('user', user, user.username);;
  } catch (err) {
    this.err = err;
    yield next;
  }
}
