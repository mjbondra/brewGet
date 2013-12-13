
/**
 * Module dependencies
 */
var msg = require('../../config/messages')
  , _ = require('underscore');

/**
 * Helper Functions
 */
exports.functions = function (req, res, next) {

  /**
   * TEMPORARY
   * Testing cookie/session
   */
  // res.clearCookie('nameo');
  // res.cookie('ip', req.ip, { signed: true });
  // console.log('cookie:', req.cookies);
  // console.log('signedCookie', req.signedCookies);
  // console.log('session:', req.session);
  console.log('sessionUser: ', req.user);

  // if ( req.signedCookies.ip && req.signedCookies.ip === req.ip ) {
  //   console.log('yay! same ip!');
  // } else {
  //   console.log('boo! wrong ip!');
  // }

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
      JSON FUNCTIONS
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
   * Accepts an array of objects returned by msgJSON() as its first parameter
   *
   * @param {array} msgJSONArray - an array of message-containing objects, ideally created individually by msgJSON()
   * @param {integer} [status] - http status code for response
   */
  resMsgJSON = function (msgJSONArray, status) {
    var resJSON = {};
    resJSON.messages = [];
    msgJSONArray.forEach(function (msgObj) {
      resJSON.messages.push(msgObj);
    });
    if (typeof status !== 'undefined') return res.json(status, resJSON);
    res.json(resJSON);
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
   */
  resCreated = function (contentType, mongooseDoc, title) {
    title = title || mongooseDoc.title;
    resMsgJSON([ msgJSON(msg[contentType].created(title), 'success', contentType, censor(mongooseDoc)) ], 201);
  }

  resModified = function () {}
  resDeleted = function () {}

  next();
}