
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
  /** prevent duplicate mongo ID errors */
  if (req.body._id) delete req.body._id;
  next();
}

/**
 * Validation Error handler
 */
exports.validationErrorHandler = function (err, req, res, next) {
  var errJSON = {};

  /** Mongo errors */
  if (err.name === 'MongoError' && err.err) {

    /** duplicate key */
    if (( err.code === 11000 || err.code === 11001 )) {
      errJSON.status = err.status || 409; // 409 Conflict
      var mongoError = err.err.match(/index:.*\.(.*)\.\$(.*)_.*dup\skey:\s{\s:\s"(.*)"/);
      var dbCollection = ( mongoError ? mongoError[1] : 'content' );
      var collectionField = ( mongoError ? mongoError[2] : 'field' );
      var fieldValue = ( mongoError ? mongoError[3] : 'value' );
      var mongoErrorObj = { field: collectionField, message: msg.notUnique(collectionField, fieldValue) }
      errJSON.fieldValidationErrors = [ mongoErrorObj ];
    }

  /** Mongoose validation errors */
  } else if (err.name === 'ValidationError' && err.errors) {
    errJSON.status = err.status || 422; // 422 Unprocessable Entity
    errJSON.fieldValidationErrors = [];
    var objKeys = Object.keys(err.errors);
    objKeys.forEach(function (key) {
      var validationErrorObj = { field: err.errors[key].path, message: err.errors[key].message };
      errJSON.fieldValidationErrors.push(validationErrorObj);
    });
  }

  /** respond if fieldValidationErrors if they exist, or move to the next error middleware */
  if (errJSON.fieldValidationErrors) {
    console.log(errJSON);
    return res.json(errJSON.status, errJSON);
  }
  console.log(err);
  res.json(err);
}

