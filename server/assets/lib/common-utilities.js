
/**
 * A collection of common utilities
 */

/**
 * Module dependencies
 */
var msg = require('../../config/messages')
  , _ = require('underscore');

/*------------------------------------*\
    FILTERS & MODIFIERS 
\*------------------------------------*/

/**
 * Censor arrays and single instances of Mongoose-modeled documents
 *
 * Prevents the inclusion of ids, versions, salts, and hashes
 *
 * @param {object|array} obj - Mongoose-modeled document(s)
 * @param {array|string} [keys=_id] - an array of keys to omit
 * @returns {object|array} - censored version of Mongoose-modeled document(s)
 */
exports.censor = function (obj, keys) {
  if (typeof obj !== 'object') return obj;
  else if (obj instanceof Date) return obj;
  else if (Array.isArray(obj)) { // is Object Array
    var _obj = [];
    var i = obj.length;
    while(i--) _obj.push(this.censor(obj[i]));
  } else { // is Object
    var _obj = _.omit(obj && obj._doc ? obj._doc : obj, keys || '_id');
    _objKeys = Object.keys(_obj);
    var i = _objKeys.length;
    while(i--) _obj[_objKeys[i]] = this.censor(_obj[_objKeys[i]]);
  }
  return _obj;
}

/**
 * Convert string to slug
 *
 * @param {string} str - string to convert
 * @returns {string} - slug
 */
exports.slug = function (str) {
  return str.toLowerCase().replace(/[ |_]/g, '-').replace(/[^\w-]+/g,'');
}

/*------------------------------------*\
    JSON MESSAGE FUNCTIONS
\*------------------------------------*/

/**
 * Creates a single JSON-ready message-containing object
 *
 * Pairs a message with other relevant identifiers and data
 *
 * @param {string} [message] - message to be passed to client
 * @param {string} [type] - type of message
 * @param {string} [related] - related field or value-type
 * @param {string|object|array} [value] - relavent value related to message
 * @returns {object} - a JSON-ready object that contains a message along with relevant identifiers and data
 */
exports.msg = function (message, type, related, value) {
  var msgObj = {};
  if (typeof message !== 'undefined') msgObj.message = message;
  if (typeof type !== 'undefined') msgObj.type = type;
  if (typeof related !== 'undefined') msgObj.related = related;
  if (typeof value !== 'undefined') msgObj.value = value;
  return msgObj;
}

/**
 * Response handler for JSON-ready message objects
 *
 * Accepts an array of objects returned by msgJSON()
 *
 * @param {array} msgJSONArray - an array of message-containing objects, ideally created individually by msgJSON()
 * @returns {object} - a response-ready JSON object that can be passed directly to this.body
 */
exports.body = function (msgJSONArray) {
  var _resJSON = {};
  if (!Array.isArray(msgJSONArray)) msgJSONArray = [ msgJSONArray ];
  _resJSON.messages = msgJSONArray;
  return _resJSON;
}

/*------------------------------------*\
    CRUD RESPONSE FUNCTIONS
\*------------------------------------*/

/**
 * Response handler for successfully added content
 *
 * @param {string} contentType - content-type name
 * @param {object} mongooseDoc - Mongoose-modeled document
 * @param {string} [title] - value by which content is known, addressed, or referred
 * @returns {object} - a response-ready JSON object that can be passed directly to this.body
 */
exports.created = function (contentType, mongooseDoc, title) {
  title = title || mongooseDoc.title;
  return this.body(this.msg(msg[contentType].created(title), 'success', contentType, this.censor(mongooseDoc)));
}

exports.updated = function (contentType, mongooseDoc, title) {
  title = title || mongooseDoc.title;
  return this.body(this.msg(msg[contentType].updated(title), 'success', contentType, this.censor(mongooseDoc)));
}

exports.deleted = function (contentType, mongooseDoc, title) {
  title = title || mongooseDoc.title;
  return this.body(this.msg(msg[contentType].deleted(title), 'success', contentType, this.censor(mongooseDoc)));
}
