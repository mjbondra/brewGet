
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
var User = mongoose.model('User');

/**
 * Mongo projection paramater; includes or excludes fields
 */
var projection = { _id: 0, __v: 0, hash: 0, salt: 0, 'images._id': 0 };


module.exports = {

  /**
   * Index
   * GET /api/users
   */
  index: function *(next) {
    this.body = yield Q.ninvoke(User, 'find', {}, projection);
  },

  /**
   * Show
   * GET /api/users/:username
   */
  show: function *(next) {
    var user = yield Q.ninvoke(User, 'findOne', { username: this.params.username }, projection);
    if (!user) return yield next; // 404 Not Found
    this.body = user;
  },

  /**
   * Create
   * POST /api/users
   */
  create: function *(next) {
    var user = new User(this.request.body);
    yield Q.ninvoke(user, 'save');
    this.user = user;
    this.session.user = user.id; // Serialize user to session
    this.status = 201; // 201 Created
    this.body = yield cU.created('user', user, user.username);
  },

  /**
   * Update
   * PUT /api/users/:username
   */
  update: function *(next) {
    var user = yield Q.ninvoke(User, 'findOne', { username: this.params.username });
    if (!user) return yield next; // 404 Not Found
    user = _.extend(user, this.request.body);
    yield Q.ninvoke(user, 'save');
    this.body = yield cU.updated('user', user, user.username);
  },

  /**
   * Destroy
   * DELETE /api/users/:username
   */
  destroy: function *(next) {
    var user = yield Q.ninvoke(User, 'findOneAndRemove', { username: this.params.username });
    if (!user) return yield next; // 404 Not Found
    this.session = {};
    this.body = yield cU.deleted('user', user, user.username);
  },

  /*------------------------------------*\
      Images
  \*------------------------------------*/

  images: {

    /**
     * CREATE
     * POST /api/users/:username/image
     */
    create: function *(next) {
      // var user = yield Q.ninvoke(User, 'findOne', { username: this.params.username });
      // if (!user) return yield next; // 404 Not Found
      // if (this.req.files.file) user.images = [ this.req.files.file ];
      // yield Q.ninvoke(user, 'save');
      // var readStream = this.req.files.file.path;
      console.log(this.req.files);
      yield next;
    },

    /**
     * DESTROY
     * DELETE /api/users/:username/image
     */
    destroy: function *(next) {
      yield next;
    }
  },

  /*------------------------------------*\
      Sessions
  \*------------------------------------*/

  sessions: {

    /**
     * Deserialize user from session
     * Make available to app as this.user
     */
    show: function () {
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
    },

    /**
     * Sign in
     * POST /api/users/sign-in
     */
    create: function *(next) {
      var msgJSONArray = [];
      if (typeof this.request.body.username === 'undefined') msgJSONArray.push(cU.msg(msg.username.isNull, 'validation', 'username'));
      if (typeof this.request.body.password === 'undefined') msgJSONArray.push(cU.msg(msg.password.isNull, 'validation', 'password'));
      if (msgJSONArray.length > 0) {
        this.status = 422; // 422 Unprocessable Entity
        this.body = yield cU.body(msgJSONArray);
        return;
      }
      var user = yield Q.ninvoke(User, 'findOne', { username: this.request.body.username });
      if (!user) {
        this.status = 401; // 401 Unauthorized
        this.body = yield cU.body(cU.msg(msg.authentication.incorrect.user(this.request.body.username), 'authentication', 'user'));
        return;
      }
      if (!user.authenticate(this.request.body.password, user.salt)) {
        this.status = 401; // 401 Unauthorized
        this.body = yield cU.body(cU.msg(msg.authentication.incorrect.password, 'authentication', 'user'));
        return;
      }
      this.user = user;
      this.session.user = user.id; // Serialize user to session
      this.status = 201; // 201 Created
      this.body = yield cU.body(cU.msg(msg.authentication.success(user.username), 'success', 'user', cU.censor(user, ['_id', '__v', 'hash', 'salt']))); // 201 Created
    },

    /**
     * Sign out
     * DELETE /api/users/sign-out
     */
    destroy: function *(next) {
      this.user = null;
      this.session = null;
      this.body = yield cU.body(cU.msg('logout'));
    } 
  } 
}
