
exports.authenticate = function () {
  return function *(next) {
    console.log(this);
  }
}
