
/**
 * A collection of global functions that pertain to JSON responses
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
 * @returns {object|array} - censored version of Mongoose-modeled document(s)
 */
censor = function (obj) {
  if (typeof obj !== 'object') return obj;
  if (_.isArray(obj)) { // is Object Array
    var _obj = [];
    obj.forEach(function (o, key) {
      _obj.push(censor(o));
    });
  } else { // is Object
    var _obj = _.omit(obj && obj._doc ? obj._doc : obj, '_id', '__v', 'hash', 'salt');
    _objKeys = Object.keys(_obj);
    _objKeys.forEach(function (key) {
      _obj[key] = censor(_obj[key]);
    });
  }
  return _obj;
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
msgJSON = function (message, type, related, value) {
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
resJSON = function (msgJSONArray) {
  var _resJSON = {};
  if (!_.isArray(msgJSONArray)) msgJSONArray = [ msgJSONArray ];
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
resCreated = function (contentType, mongooseDoc, title) {
  title = title || mongooseDoc.title;
  return resJSON(msgJSON(msg[contentType].created(title), 'success', contentType, censor(mongooseDoc)));
}

resUpdated = function (contentType, mongooseDoc, title) {
  title = title || mongooseDoc.title;
  return resJSON(msgJSON(msg[contentType].updated(title), 'success', contentType, censor(mongooseDoc)));
}

resDeleted = function (contentType, mongooseDoc, title) {
  title = title || mongooseDoc.title;
  return resJSON(msgJSON(msg[contentType].deleted(title), 'success', contentType, censor(mongooseDoc)));
}
