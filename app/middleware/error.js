
/**
 * Module dependencies
 */
var mongoose = require('mongoose')
  , msg = require('../../config/messages');

/**
 * Models
 */
var _Error = mongoose.model('Error');

/**
 * Validation error handler
 */
exports.validate = function (err, req, res, next) {

  /** Mongo errors */
  if (err.name === 'MongoError' && err.err) {

    /** duplicate key */
    if (( err.code === 11000 || err.code === 11001 )) {
      var mongoError = err.err.match(/index:.*\.(.*)\.\$(.*)_.*dup\skey:\s{\s:\s"(.*)"/);
      var dbCollection = ( mongoError ? mongoError[1] : 'content' );
      var collectionField = ( mongoError ? mongoError[2] : 'field' );
      var fieldValue = ( mongoError ? mongoError[3] : 'value' );
      return resMsgJSON(msgJSON(msg.notUnique(collectionField, fieldValue), 'validation', collectionField, fieldValue), 409); // 409 Conflict
    }

  /** Mongoose validation errors */
  } else if (err.name === 'ValidationError' && err.errors) {
    console.log(err);
    var msgJSONArray = [];
    var objKeys = Object.keys(err.errors);
    objKeys.forEach(function (key) {
      msgJSONArray.push(msgJSON(err.errors[key].message, 'validation', err.errors[key].path, err.errors[key].value));
    });
    return resMsgJSON(msgJSONArray, 422); // 422 Unprocessable Entity
  }

  /** send to error logging */
  next(err);
}

/**
 * Error logging
 */
exports.log = function (err, req, res, next) {

  /** record errors as Mongoose-modeled documents */
  var _error = new _Error({ 
    method: req.method,
    referer: req.headers.referer,
    stack: err.stack,
    status: err.status || 500,
    url: req.url,
    user: typeof req.user !== 'undefined' ? req.user.id : null,
    userIP: req.ip
  });
  _error.save(function (err) {
    if (err) return next(err);
  });

  /** send to error responder */
  next(err);
}

/**
 * Error responding
 */
exports.respond = function (err, req, res, next) {
  var resJSON = {};
  var status = err.status || 500;

  resJSON.messages = [{ 
    message: msg.status[status] || msg.status[500], 
    type: 'error' 
  }];

  /** respond to errors with JSON  */
  res.json(status, resJSON);
}
