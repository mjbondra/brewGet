
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
exports.index = function (req, res, next) {
  Q.ninvoke(User, 'find')
    .then(function (users) {
      res.json(censor(users));
    })
    .fail(function (err) {
      next(err);
    });
}

/**
 * Create
 * POST /api/users/new 
 */
exports.create = function (req, res, next) {
  var user = new User(req.body);
  Q.ninvoke(user, 'save')
    .then(function () {
      resCreated('user', user, user.username);
    })
    .fail(function (err) {
      next(err);
    });
}

/*------------------------------------*\
    Authentication
\*------------------------------------*/

/**
 * Authenticate
 * POST /api/users/authenticate
 */
exports.authenticate = function (passport) {
  return function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      if (err) return next(err); // error
      if (user === false) return res.json({});
      req.login(user, function (err) { // login success
        if (err) return next(err); // error
        res.json({login: 'success'});
      });
    })(req, res, next);
  };
}

/**
 * Sign out
 * GET /api/users/logout
 */
exports.logout = function (req, res, next) {
  req.session.destroy();
  res.json({logout: 'success'});
}
