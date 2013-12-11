
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

  /**
   * Authentication helper function
   *
   * Handles results of passport.authenticate()
   *
   * @param {object} err - error object
   * @param {object} user - user model instance
   * @param {string} info - message in response to authentication attempt
   */
  auth = function (err, user, info) {
    if (err) return next(err); // error
    if (user === false) { // login failed
      return res.json({login: 'failed'});
    }
    req.login(user, function (err) { // login success
      if (err) return next(err); // error
      res.json({login: 'success'});
    });
  }

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

  /**
   * Response handler for successfully added content
   *
   * @param {string} type - content-type name
   * @param {object} mongooseDoc - Mongoose-modeled document
   * @param {string} [title] - value by which content is known, addressed, or referred
   */
  resCreated = function (type, mongooseDoc, title) {
    title = title || mongooseDoc.title;
    var resJSON = {};
    resJSON.messages = [{ 
      message: msg[type].created(title), 
      related: type, 
      type: 'success', 
      value: censor(mongooseDoc) 
    }];
    console.log(resJSON);
    res.json(201, resJSON); // 201 Created
  }

  resModified = function () {}
  resDeleted = function () {}

  next();
}