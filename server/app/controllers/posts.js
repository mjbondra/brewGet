
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
var Post = mongoose.model('Post');

module.exports = {
  index: function *(next) {},
  show: function *(next) {},

  /**
   * Create
   * POST /api/posts
   */
  create: function *(next) {
    var post = new Post(yield coBody(this));
    post.user = this.user;
    yield Promise.promisify(post.save, post)().catch(function (err) { throw err; });
    this.status = 201; // 201 Created
    this.body = yield cU.created('post', post, post.title);
  },

  update: function *() {},
  destroy: function *(next) {}
}