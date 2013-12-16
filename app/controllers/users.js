
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
 * Sign in
 * POST /api/users/sign-in
 */
exports.signIn = function (passport) {
  return function (req, res, next) {
    var msgJSONArray = [];
    if (typeof req.body.username === 'undefined') msgJSONArray.push(msgJSON(msg.username.isNull, 'validation', 'username'));
    if (typeof req.body.password === 'undefined') msgJSONArray.push(msgJSON(msg.password.isNull, 'validation', 'password'));
    if (msgJSONArray.length > 0) return resMsgJSON(msgJSONArray, 422) // 422 Unprocessable Entity
    passport.authenticate('local', function (err, user, info) {
      if (err) return next(err); // error
      if (user === false) return resMsgJSON(msgJSON(info.message, 'authentication', 'user'), 401); // 401 Unauthorized
      req.login(user, function (err) { // login success
        if (err) return next(err); // error
        resMsgJSON(msgJSON(msg.authentication.success(user.username), 'success', 'user', censor(user)), 201); // 201 Created
      });
    })(req, res, next);
  };
}

/**
 * Sign out
 * DELETE /api/users/sign-out
 */
exports.signOut = function (req, res, next) {
  req.session.destroy();
  res.json({logout: 'success'});
}
