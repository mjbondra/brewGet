
exports.requires = {
  authentication: function *(next) {
    if (this.session.user) return yield next;
    this.status = 401;
    this.body = { msg: 'not auth' }
  },
  role: function (role) {
    return function *(next) {
      if (this.session.user && this.session.user.role === role) return yield next;
      this.status = 401;
      this.body = { msg: 'not role' }
    }
  },
  self: function *(next) {
    if (this.user && this.session.user && this.user.slug === this.session.user.slug) return yield next;
    this.status = 401;
    this.body = { msg: 'not self' }
  }
}
