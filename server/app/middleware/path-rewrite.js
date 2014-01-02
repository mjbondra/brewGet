
/**
 * Path rewrite middleware
 *
 * param {string} path - path to rewrite
 * param {string} rewrite - rewrite path
 * returns {generator} - checks for path to rewrite on each request and yields to subsequent middleware
 */
module.exports = function (path, rewrite) {
  return function *(next) {
    if (this.path === path) this.path = rewrite;
    yield next;
  }
}
