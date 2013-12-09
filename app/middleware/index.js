
/**
 * Module dependencies
 */
var mongoose = require('mongoose')
  , msg = require('../../config/messages')
  , Q = require('q')
  , _ = require('underscore');

/**
 * Models
 */
var User = mongoose.model('User');

/**
 * Helpers
 */
exports.helpers = function (req, res, next) {

  /**
   * TEMPORARY
   * Testing cookie/session
   */
  // res.clearCookie('nameo');
  // res.cookie('ip', req.ip, { signed: true });
  // console.log('cookie:', req.cookies);
  // console.log('signedCookie', req.signedCookies);
  // console.log('session:', req.session);
  // if ( req.signedCookies.ip && req.signedCookies.ip === req.ip ) {
  //   console.log('yay! same ip!');
  // } else {
  //   console.log('boo! wrong ip!');
  // }

  /**
   * Censor arrays and single instances of Mongoose-modeled documents
   *
   * @param obj {object|array} - Mongoose-modeled document(s)
   * @returns {object|array} - Censored Mongoose-modeled document(s)
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
   * @param type {string} - content-type name
   * @param mongooseDoc {object} - Mongoose-modeled document
   * @param message {string} - success message for added content
   */
  newContentResponse = function (type, mongooseDoc, message) {
    var resJSON = {};
    resJSON.messages = [{ message: message, related: type, type: 'success', value: censor(mongooseDoc) }];
    console.log(resJSON);
    res.json(201, resJSON); // 201 Created
  }

  next();
}

/**
 * Validation Error handler
 */
exports.validationErrorHandler = function (err, req, res, next) {
  var resJSON = {};

  /** Mongo errors */
  if (err.name === 'MongoError' && err.err) {

    /** duplicate key */
    if (( err.code === 11000 || err.code === 11001 )) {
      err.status = 409; // 409 Conflict
      var mongoError = err.err.match(/index:.*\.(.*)\.\$(.*)_.*dup\skey:\s{\s:\s"(.*)"/);
      var dbCollection = ( mongoError ? mongoError[1] : 'content' );
      var collectionField = ( mongoError ? mongoError[2] : 'field' );
      var fieldValue = ( mongoError ? mongoError[3] : 'value' );
      var mongoErrorObj = { message: msg.notUnique(collectionField, fieldValue), related: collectionField, type: 'validation', value: fieldValue }
      resJSON.messages = [ mongoErrorObj ];
    }

  /** Mongoose validation errors */
  } else if (err.name === 'ValidationError' && err.errors) {
    err.status = 422; // 422 Unprocessable Entity
    resJSON.messages = [];
    var objKeys = Object.keys(err.errors);
    objKeys.forEach(function (key) {
      var validationErrorObj = { message: err.errors[key].message, related: err.errors[key].path, type: 'validation', value: err.errors[key].value };
      resJSON.messages.push(validationErrorObj);
    });
  }

  /** respond if messages if they exist, or move to the next error middleware */
  if (resJSON.messages) {
    console.log(resJSON);
    return res.json(err.status, resJSON);
  }
  console.log(err);
  res.json(err);
}

