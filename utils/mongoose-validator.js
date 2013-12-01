
/**
 * Create and export an error-prototyped Validator object that does 
 * not throw app-ending errors when validations fail; this works well 
 * for implemenations in Mongoose Schema Object validations.
 */

var Validator = require('validator').Validator
  , validate = new Validator();

validate.error = function () { return false; }

exports.check = {
  is: function (value, pattern, modifiers) {
    if (!value) return true;
    return validate.check(value).is(pattern, modifiers);
  },
  not: function (value, pattern, modifiers) {
    if (!value) return true;
    return validate.check(value).not(pattern, modifiers);
  },
  isEmail: function (value) {
    if (!value) return true;
    return validate.check(value).isEmail();
  },
  isUrl: function (value) {
    if (!value) return true;
    return validate.check(value).isUrl();
  },
  isIP: function (value) {
    if (!value) return true;
    return validate.check(value).isIP();
  },
  isIPv4: function (value) {
    if (!value) return true;
    return validate.check(value).isIPv4();
  },
  isIPv6: function (value) {
    if (!value) return true;
    return validate.check(value).isIPv6();
  },
  isAlpha: function (value) {
    if (!value) return true;
    return validate.check(value).isAlpha();
  },
  isAlphanumeric: function (value) {
    if (!value) return true;
    return validate.check(value).isAlphanumeric();
  },
  isNumeric: function (value) {
    if (!value) return true;
    return validate.check(value).isNumeric();
  },
  isHexadecimal: function (value) {
    if (!value) return true;
    return validate.check(value).isHexadecimal();
  },
  isHexColor: function (value) {
    if (!value) return true;
    return validate.check(value).isHexColor();
  },
  isInt: function (value) {
    if (!value) return true;
    return validate.check(value).isInt();
  },
  isLowercase: function (value) {
    if (!value) return true;
    return validate.check(value).isLowercase();
  }, 
  isUppercase: function (value) {
    if (!value) return true;
    return validate.check(value).isUppercase();
  },
  isDecimal: function (value) {
    if (!value) return true;
    return validate.check(value).isDecimal();
  },
  isFloat: function (value) {
    if (!value) return true;
    return validate.check(value).isFloat();
  },
  notNull: function (value) {
    return validate.check(value).notNull();
  }, 
  isNull: function (value) {
    return validate.check(value).isNull();
  }, 
  notEmpty: function (value) {
    return validate.check(value).notEmpty();
  },
  equals: function (value, equals) {
    if (!value) return true;
    return validate.check(value).equals(equals);
  },
  contains: function (value, str) {
    if (!value) return true;
    return validate.check(value).contains(str);
  },
  notContains: function (value, str) {
    if (!value) return true;
    return validate.check(value).notContains(str);
  },
  regex: function (value, pattern, modifiers) {
    if (!value) return true;
    return validate.check(value).regex(pattern, modifiers);
  },
  notRegex: function (value, pattern, modifiers) {
    if (!value) return true;
    return validate.check(value).notRegex(pattern, modifiers);
  },
  len: function (value, min, max) {
    if (!value) return true;
    return validate.check(value).len(min, max);
  },
  isUUID: function (value, version) {
    if (!value) return true;
    return validate.check(value).isUUID(version);
  },
  isUUIDv3: function (value) {
    if (!value) return true;
    return validate.check(value).isUUIDv3();
  },
  isUUIDv4: function (value) {
    if (!value) return true;
    return validate.check(value).isUUIDv4();
  },
  isDate: function (value) {
    if (!value) return true;
    return validate.check(value).isDate();
  },
  isAfter: function (value) {
    if (!value) return true;
    return validate.check(value).isAfter(date);
  },
  isBefore: function (value) {
    if (!value) return true;
    return validate.check(value).isBefore(date);
  },
  isIn: function (value, options) {
    if (!value) return true;
    return validate.check(value).isIn(options);
  },
  notIn: function (value, options) {
    if (!value) return true;
    return validate.check(value).notIn(options);
  },
  max: function (value, max) {
    if (!value) return true;
    return validate.check(value).max(max);
  },
  min: function (value, min) {
    if (!value) return true;
    return validate.check(value).min(min);
  },
  isCreditCard: function (value) {
    if (!value) return true;
    return validate.check(value).isCreditCard();
  }
}
