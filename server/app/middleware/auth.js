
/**
 * Module dependencies
 */
var cU = require('../../assets/lib/common-utilities')
  , msg = require('../../config/messages');

exports.requires = {
  authentication: function *(next) {
    if (this.session.user) return yield next;
    this.status = 401;
    this.body = yield cU.body(cU.msg(msg.authentication.requires.authentication(this.path)));
  },
  role: function (role) {
    return function *(next) {
      if (this.session.user && this.session.user.role === role) return yield next;
      this.status = 401;
      this.body = yield cU.body(cU.msg(msg.authentication.requires.role(this.path)));
    };
  },
  self: function *(next) {
    if (this.user && this.session.user && this.user.slug === this.session.user.slug) return yield next;
    this.status = 401;
    this.body = yield cU.body(cU.msg(msg.authentication.requires.self(this.params.username, this.path)));
  }
};
