/**
 * This module creates a string which contains fieldnames and values in the style of url-encoding 
 * to leverage the objectifying power of the qs module. Though the performance hit for doing this is minimal, 
 * I would like to mimick the functionality of qs internally, and avoid the step of creating this string.
 */
 
/**
 * Module dependencies
 */
var qs = require('qs');

/**
 * @constructor
 */
var ffObj = function () {
  this._fieldStr = '';
  this._objStr = '';
}

/**
 * Add field and value to cummulative field string
 *
 * @param fieldname {string} - name of field, which can include backets (ex. someField[someKey][0])
 * @param value {string|object} - value associated with field
 */
ffObj.prototype.addField = function *(fieldname, value) {
  if (value && typeof value === 'object') {
    yield this.stringify(fieldname, value);
    this._fieldStr = ( this._fieldStr ? this._fieldStr + '&' : '' ) + this._objStr;
    this._objStr = '';
  } else {
    this._fieldStr = ( this._fieldStr ? this._fieldStr + '&' : '' ) + fieldname + '=' + value;
  }
}

/**
 * Return qs parsed field string
 *
 * @returns {object} - an object containing an arranged set of fieldnames and values
 */
ffObj.prototype.getFields = function *() {
  return qs.parse(this._fieldStr);
}

/**
 * Stringify an object so that it can be parsed by qs
 *
 * @param fieldname {string} - name of field, which can include backets (ex. someField[someKey][0])
 * @param value {object} - value associated with field
 */
ffObj.prototype.stringify = function *(fieldname, value) {
  if (!value || typeof value !== 'object') return;
  var objKeys = Object.keys(value)
    , i = objKeys.length;
  while (i--) {
    if (typeof value[objKeys[i]] === 'object') yield this.stringify(fieldname + '[' + objKeys[i] + ']', value[objKeys[i]]);
    else if (typeof value[objKeys[i]] === 'string' || typeof value[objKeys[i]] === 'number' || typeof value[objKeys[i]] === 'boolean') this._objStr = (this._objStr ? this._objStr + '&' : '') + fieldname + '[' + objKeys[i] + ']=' + value[objKeys[i]];
  }
}

/**
 * Create a form-field-objectify Object
 */
exports.create = function () {
  return new ffObj();
}
