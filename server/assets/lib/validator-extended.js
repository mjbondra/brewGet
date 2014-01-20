/**
 * Extends validator.js to include additional validators
 */

var validator = require('validator');

validator.inUSA = function (str) {
  str = str || '';
  var names = ['US', 'USA', 'United States', 'United States of America'];
  return names.indexOf(str) >= 0;
}

validator.notNull = function (str) {
  str = str || '';
  return str.length !== 0;
}

validator.over21 = function (date) {
  date = date || new Date();
  var d = new Date();
  d.setFullYear(d.getFullYear() - 21);
  return validator.isBefore(date, d);
}

module.exports = validator;
