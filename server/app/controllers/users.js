
/**
 * Module dependencies
 */
var coBody = require('co-body')
  , cU = require('../../assets/lib/common-utilities')
  , mongoose = require('mongoose')
  , msg = require('../../config/messages')
  , Promise = require('bluebird')
  , _ = require('underscore');

// Promise.prototype.catch(function (err) { throw err; });

/**
 * Models
 */
var Image = mongoose.model('Image')
  , User = mongoose.model('User');

/**
 * Mongo projection paramater; includes or excludes fields
 */
var projection = { _id: 0, __v: 0, hash: 0, salt: 0, 'images._id': 0, 'images.path': 0 };

module.exports = {

  /**
   * Index
   * GET /api/users
   */
  index: function *(next) {
    this.body = yield Promise.promisify(User.find, User)({}, projection);
  },

  /**
   * Show
   * GET /api/users/:slug
   */
  show: function *(next) {
    var user = yield Promise.promisify(User.findOne, User)({ slug: this.params.slug }, projection);
    if (!user) return yield next; // 404 Not Found
    this.body = user;
  },

  /**
   * Create
   * POST /api/users
   */
  create: function *(next) {
    var user = new User(yield coBody(this));
    yield Promise.promisify(user.save, user)();
    this.user = user;
    this.session.user = user.id; // Serialize user to session
    this.status = 201; // 201 Created
    this.body = yield cU.created('user', user, user.username);
  },

  /**
   * Update
   * PUT /api/users/:slug
   */
  update: function *(next) {
    var user = yield Promise.promisify(User.findOne, User)({ slug: this.params.slug });
    if (!user) return yield next; // 404 Not Found
    user = _.extend(user, _.omit(yield coBody(this), 'images'));
    yield Promise.promisify(user.save, user)();
    this.body = yield cU.updated('user', user, user.username);
  },

  /**
   * Destroy
   * DELETE /api/users/:slug
   */
  destroy: function *(next) {
    var user = Promise.promisify(User.findOneAndRemove, User)({ slug: this.params.slug });
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
     * POST /api/users/:slug/image
     */
    create: function *(next) {
      var user = yield Promise.promisify(User.findOne, User)({ slug: this.params.slug });
      if (!user) return yield next; // 404 Not Found
      var image = new Image()
        , imageHiDPI = new Image()
        , imageLoDPI = new Image()
        , imageSmHiDPI = new Image()
        , imageSmLoDPI = new Image()

      // stream image from form data
      yield image.stream(this, { alt: user.username, crop: true, type: 'users' });
      yield [ // resize multiple images asynchronously; yield until all are complete
        imageHiDPI.resize(image, { highDPI: true }), // 50% height / 50% width
        imageLoDPI.resize(image, { geometry: { height: 25, width: 25 }}), // 25% height / 25% width 
        imageSmHiDPI.resize(image, { geometry: { height: 80, width: 80 }, highDPI: true, percentage: false }),
        imageSmLoDPI.resize(image, { geometry: { height: 40, width: 40 }, percentage: false })
      ];

      // remove old images
      if (user.images.length > 0) {
        var i = user.images.length;
        while (i--) {
          yield user.images[i].destroy();
        }
      }
      user.images = [ image, imageHiDPI, imageLoDPI, imageSmHiDPI, imageSmLoDPI ]; // limit user images to a single (current) image
      
      yield Promise.promisify(user.save, user)();
      this.status = 201;
      this.body = yield cU.censor(user.images, [ '_id', 'path' ]);
    },

    /**
     * DESTROY
     * DELETE /api/users/:slug/image
     */
    destroy: function *(next) {
      var user = yield Promise.promisify(User.findOne, User)({ slug: this.params.slug });
      if (!user) return yield next; // 404 Not Found

      // remove images
      if (user.images.length > 0) {
        var i = user.images.length;
        while (i--) {
          yield user.images[i].destroy();
        }
      }
      user.images = [];
      yield Promise.promisify(user.save, user)();
      this.body = msg.image.deleted;
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
          this.user = yield Promise.promisify(User.findById, User)(this.session.user).catch(function (err) {
            console.failure('There was an error while trying to deserialize session user', { id: this.session.user }, err.stack);
          });
        }
        yield next;

        // populate cookie for frontend -- presence of this cookie does not grant authenticated access on backend
        if (this.user) {
          this.cookies.set('username', this.user.username, { httpOnly: false, overwrite: true, signed: true });
        } else {
          this.cookies.set('username', null, { httpOnly: false, overwrite: true, signed: true });
        }
      }
    },

    /**
     * Sign in
     * POST /api/users/sign-in
     */
    create: function *(next) {
      var body = yield coBody(this);
      var msgJSONArray = [];
      if (typeof body.username === 'undefined') msgJSONArray.push(cU.msg(msg.username.isNull, 'validation', 'username'));
      if (typeof body.password === 'undefined') msgJSONArray.push(cU.msg(msg.password.isNull, 'validation', 'password'));
      if (msgJSONArray.length > 0) {
        this.status = 422; // 422 Unprocessable Entity
        this.body = yield cU.body(msgJSONArray);
        return;
      }
      var user = yield Promise.promisify(User.findOne, User)({ $or: [ { username: body.username }, { email: body.username } ] });
      if (!user) {
        this.status = 401; // 401 Unauthorized
        this.body = yield cU.body(cU.msg(msg.authentication.incorrect.user(body.username), 'authentication', 'user'));
        return;
      }
      if (!user.authenticate(body.password, user.salt)) {
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
