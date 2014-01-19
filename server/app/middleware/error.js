
/**
 * Module dependencies
 */
var cU = require('../../assets/lib/common-utilities')
  , mongoose = require('mongoose')
  , msg = require('../../config/messages')
  , Q = require('q')
  , _ = require('underscore');

/**
 * Models
 */
var _Error = mongoose.model('Error');

/** 
 * Validation error names 
 */
var validationsError = [
  'MongoError', 
  'ValidationError'
];

/**
 * Error responding
 */
exports.respond = function () {
  return function *(next) {

    // Catch 404s, and do not yield to other error middleware
    if (!this.err) {
      this.status = 404;
      this.body = yield cU.body(cU.msg(msg.status[404]));
      return;
    }
    // yield to error logging
    yield next;

    var err = this.err;
    var status = err.status || 500;

    // respond to errors with JSON, but do not overwrite an existing response
    this.status = status; 
    if (!this.body) this.body = yield cU.body(cU.msg(msg.status[status] || msg.status[500], 'error'));
  }
}

/**
 * Error logging
 */
exports.log = function () {
  return function *(next) {
    var err = this.err;

    // yield to validation errors
    if (validationsError.indexOf(err.name) >= 0) return yield next;

    try {
      // record errors as Mongoose-modeled documents
      var _error = new _Error({ 
        method: this.method,
        params: typeof this.request.body !== 'undefined' ? _.omit(this.request.body, 'password') : {},
        referer: this.header.referer,
        stack: err.stack,
        status: err.status || 500,
        url: this.url,
        user: typeof this.user !== 'undefined' ? this.user.id : null,
        userIP: this.ip
      });
      yield Q.ninvoke(_error, 'save');
    } catch (err) {
      // print error logging error to console, but do not overwrite original error
      console.failure(err.stack);
    }
  }
}

/**
 * Validation error handler
 */
exports.validate = function () {
  return function *() {
    var err = this.err;

    // Mongo errors
    if (err.name === 'MongoError' && err.err) {

      // duplicate key
      if (( err.code === 11000 || err.code === 11001 )) {
        var mongoError = err.err.match(/index:.*\.(.*)\.\$(.*)_.*dup\skey:\s{\s:\s"(.*)"/);
        var dbCollection = ( mongoError ? mongoError[1] : 'content' );
        var collectionField = ( mongoError ? mongoError[2] : 'field' );
        var fieldValue = ( mongoError ? mongoError[3] : 'value' );
        this.err.status = 409; // 409 Conflict
        this.body = yield cU.body(cU.msg(msg.notUnique(collectionField, fieldValue), 'validation', collectionField, fieldValue));
      }

    // Mongoose validation errors
    } else if (err.name === 'ValidationError' && err.errors) {
      var msgJSONArray = [];
      var objKeys = Object.keys(err.errors);
      objKeys.forEach(function (key) {
        msgJSONArray.push(cU.msg(err.errors[key].message, 'validation', err.errors[key].path, err.errors[key].value));
      });
      this.err.status = 422; // 422 Unprocessable Entity
      this.body = yield cU.body(msgJSONArray);
    }
  }
}

