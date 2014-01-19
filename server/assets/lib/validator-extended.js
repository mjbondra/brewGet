
var validator = require('validator');

validator.is21 = function (date) {
  date = date || new Date();
  var d = new Date();
  d.setFullYear(d.getFullYear() - 21);
  return validator.isBefore(date, d);
}

validator.notNull = function (str) {
  str = str || '';
  return str.length !== 0;
}

module.exports = validator;
