
/**
 * Module dependencies
 */
var cU = require('../../assets/lib/common-utilities')
  , msg = require('../../config/messages');

module.exports = function () {
  return function *() {
    this.status = 404;
    this.body = yield cU.body(cU.msg(msg.status[404]));
  }
}
