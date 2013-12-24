
/**
 * Module dependencies
 */
var parse = require('co-body');

module.exports = function () { 
  return function *(next) {
    if (this.is('application/x-www-form-urlencoded', 'application/json')) {
      this.request.body = yield parse(this);
    }
    yield next;
  }
}
