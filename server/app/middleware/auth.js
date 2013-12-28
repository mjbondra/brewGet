
exports.requires = {
  authentication: function *(next) {
    if (this.user) return yield next;
    this.status = 401;
    this.body = { msg: 'not auth' }
  },
  role: function (role) {
    return function *(next) {
      if (this.user && this.user.role === role) return yield next;
      this.status = 401;
      this.body = { msg: 'not role' }
    }
  },
  self: function *(next) {
    if (this.user && this.user.username === this.params.username) return yield next;
    this.status = 401;
    this.body = { msg: 'not self' }
  }
}
