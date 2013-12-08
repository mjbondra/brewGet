
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
   * Remove non-essential values from mongoose-modeled documents
   *
   * @param mongooseDoc {object} - Mongoose-modeled document
   * @returns {object} - stripped document-only portion of a Mongoose-modeled document
   */
  var stripNonEssentialValues = function (mongooseDoc) {
    mongooseDoc = mongooseDoc && mongooseDoc._doc ? mongooseDoc._doc : mongooseDoc;
    return _.omit(mongooseDoc, '__v', '_id', 'hash', 'salt');
  }

  /**
   * GLOBALLY AVAILABLE
   * Response handler for successfully added content
   *
   * @param type {string} - content-type name
   * @param mongooseDoc {object} - Mongoose-modeled document
   * @param message {string} - success message for added content
   */
  newContentResponse = function (type, mongooseDoc, message) {
    var resJSON = {};
    resJSON.messages = [{ message: message, related: type, type: 'success', value: stripNonEssentialValues(mongooseDoc) }];
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

