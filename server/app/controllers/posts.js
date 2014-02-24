
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
var Image = mongoose.model('Image')
  , Post = mongoose.model('Post');

/**
 * Mongo projection paramater; includes or excludes fields
 */
var projection = { _id: 0, __v: 0 };

module.exports = {

  /**
   * Index
   * GET /api/posts
   */
  index: function *(next) {
    this.body = yield Promise.promisify(Post.find, Post)({}, projection);
  },

  /**
   * Show
   * GET /api/posts/:slug
   */
  show: function *(next) {},

  /**
   * Create
   * POST /api/posts
   */
  create: function *(next) {
    var post = new Post(yield coBody(this));
    post.user = this.session.user;
    yield Promise.promisify(post.save, post)();
    this.status = 201; // 201 Created
    this.body = yield cU.created('post', post, post.title);
  },

  update: function *(next) {},
  destroy: function *(next) {}
}