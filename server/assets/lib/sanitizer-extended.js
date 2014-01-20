/**
 * Extends caja-sanitizer to include additional sanitizers from validator.js
 */

var sanitize = require('sanitizer')
  , validate = require('validator');

/**
 * Extend replace function to return empty strings when passed an undefined parameter
 *
 * @param {string} str - string to sanitize
 * @param {boolean} alt - if set to true, validator.js escape method will be used instead of caja
 * @return {string} - sanitized string
 */
sanitize.escape = function (str, alt) {
  if (!str) return ''; // return empty string
  return alt ? validate.escape(str) : sanitize.escapeAttrib(str);
}

sanitize.toString = function (str) { return validate.toString(str); }
sanitize.toDate = function (str) { return validate.toDate(str); }
sanitize.toFloat = function (str) { return validate.toFloat(str); }
sanitize.toInt = function (str, radix) { return validate.toInt(str, radix); }
sanitize.toBoolean = function (str, strict) { return validate.toBoolean(str, strict); }
sanitize.trim = function (str, chars) { return validate.trim(str, chars); }
sanitize.ltrim = function (str, chars) { return validate.ltrim(str, chars); }
sanitize.rtrim = function (str, chars) { return validate.rtrim(str, chars); }
sanitize.whitelist = function (str, chars) { return validate.whitelist(str, chars); }
sanitize.blacklist = function (str, chars) { return validate.blacklist(str, chars); }

module.exports = sanitize;
