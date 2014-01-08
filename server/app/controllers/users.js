
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
    yield next; // 500 Internal Server Error
  }
}

/**
 * Show
 * GET /api/users/:username
 */
exports.show = function *(next) {
  try {
    var user = yield Q.ninvoke(User, 'findOne', { username: this.params.username });
    if (!user) return yield next; // 404 Not Found
    this.body = yield censor(user);
  } catch (err) {
    this.err = err;
    yield next; // 500 Internal Server Error
  }
}

/**
 * Create
 * POST /api/users
 */
exports.create = function *(next) {
  try {
    var user = new User(this.request.body);
    yield Q.ninvoke(user, 'save');
    this.user = user;
    this.session.user = user.id; // Serialize user to session
    this.status = 201; // 201 Created
    this.body = yield resCreated('user', user, user.username);
  } catch (err) {
    this.err = err;
    yield next; // 500 Internal Server Error / 422 Unprocessable Entity / 409 Conflict
  }
}

/**
 * Update
 * PUT /api/users/:username
 */
exports.update = function *(next) {
  try {
    var user = yield Q.ninvoke(User, 'findOne', { username: this.params.username });
    if (!user) return yield next; // 404 Not Found
    user = _.extend(user, this.request.body);
    yield Q.ninvoke(user, 'save');
    this.body = yield resUpdated('user', user, user.username);
  } catch (err) {
    this.err = err;
    yield next; // 500 Internal Server Error / 422 Unprocessable Entity / 409 Conflict
  }
}

/**
 * Destroy
 * DELETE /api/users/:username
 */
exports.destroy = function *(next) {
  try {
    var user = yield Q.ninvoke(User, 'findOneAndRemove', { username: this.params.username });
    if (!user) return yield next; // 404 Not Found
    this.session = {};
    this.body = yield resDeleted('user', user, user.username);
  } catch (err) {
    this.err = err;
    yield next;
  }
}

/*------------------------------------*\
    Authentication / Session
\*------------------------------------*/

/**
 * Sign in
 * POST /api/users/sign-in
 */
exports.authenticate = function *(next) {
  try {
    var msgJSONArray = [];
    if (typeof this.request.body.username === 'undefined') msgJSONArray.push(msgJSON(msg.username.isNull, 'validation', 'username'));
    if (typeof this.request.body.password === 'undefined') msgJSONArray.push(msgJSON(msg.password.isNull, 'validation', 'password'));
    if (msgJSONArray.length > 0) {
      this.status = 422; // 422 Unprocessable Entity
      this.body = yield resJSON(msgJSONArray);
      return;
    }
    var user = yield Q.ninvoke(User, 'findOne', { username: this.request.body.username });
    if (!user) {
      this.status = 401; // 401 Unauthorized
      this.body = yield resJSON(msgJSON(msg.authentication.incorrect.user(this.request.body.username), 'authentication', 'user'));
      return;
    }
    if (!user.authenticate(this.request.body.password, user.salt)) {
      this.status = 401; // 401 Unauthorized
      this.body = yield resJSON(msgJSON(msg.authentication.incorrect.password, 'authentication', 'user'));
      return;
    }
    this.user = user;
    this.session.user = user.id; // Serialize user to session
    this.status = 201; // 201 Created
    this.body = yield resJSON(msgJSON(msg.authentication.success(user.username), 'success', 'user', censor(user))); // 201 Created
  } catch (err) {
    this.err = err;
    yield next;
  }
}

/**
 * Deserialize user from session
 * Make available to app as this.user
 */
exports.session = function () {
  return function *(next) {

    // deserialize user from session
    if (this.session.user && !this.user) {
      try {
        this.user = yield Q.ninvoke(User, 'findById', this.session.user);
      } catch (err) {
        console.failure('There was an error while trying to deserialize session user', { id: this.session.user }, err.stack);
      }
    }
    yield next;

    // populate cookie for frontend -- presence of this cookie does not grant authenticated access on backend
    if (this.user) {
      this.cookies.set('auth', JSON.stringify({ isAuthenticated: true, username: this.user.username }), { httpOnly: false, overwrite: true });
    } else {
      this.cookies.set('auth', JSON.stringify({ isAuthenticated: false }), { httpOnly: false, overwrite: true });
    }
  }
}

/**
 * Sign out
 * DELETE /api/users/sign-out
 */
exports.signOut = function *(next) {
  this.user = null;
  this.session = null;
  this.body = yield resJSON(msgJSON('logout'));
}
