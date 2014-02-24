
/**
 * Module dependencies
 */
var cU = require('../../assets/lib/common-utilities')
  , mongoose = require('mongoose')
  , msg = require('../../config/messages')
  , Promise = require('bluebird')
  , _ = require('underscore');

/**
 * Error model
 */
var Schema = mongoose.Schema
  , ErrorSchema = new Schema({
    method: String,
    params: Object,
    referer: String,
    stack: String,
    status: Number,
    url: String,
    user: { 
      type : Schema.ObjectId, 
      ref : 'User' 
    },
    userIP: String
  }), _Error = mongoose.model('Error', ErrorSchema);

/** 
 * Validation error names 
 */
var validationsError = [
  'ImageError',
  'MongoError', 
  'ValidationError'
];

module.exports = function () {
  return function *(next) {
    try {
      yield next;

    // error handling for downstream middleware
    } catch (err) {

      // shift rejection errors to their cause if they involve validation
      if (err.name === 'RejectionError' && err.cause && validationsError.indexOf(err.cause.name) >= 0) err = err.cause;

      // validation errors
      if (validationsError.indexOf(err.name) >= 0) {

        // Mongo errors
        if (err.name === 'MongoError' && err.err) {

          // duplicate key
          if (( err.code === 11000 || err.code === 11001 )) {
            var mongoError = err.err.match(/index:.*\.(.*)\.\$(.*)_.*dup\skey:\s{\s:\s"(.*)"/);
            var dbCollection = ( mongoError ? mongoError[1] : 'content' );
            var collectionField = ( mongoError ? mongoError[2] : 'field' );
            var fieldValue = ( mongoError ? mongoError[3] : 'value' );
            this.status = 409; // 409 Conflict
            this.body = yield cU.body(cU.msg(msg.notUnique(dbCollection, collectionField, fieldValue), 'validation', collectionField, fieldValue));
          }

        // Mongoose validation errors
        } else if (err.name === 'ValidationError' && err.errors) {
          var msgJSONArray = [];
          var objKeys = Object.keys(err.errors);
          objKeys.forEach(function (key) {
            msgJSONArray.push(cU.msg(err.errors[key].message, 'validation', err.errors[key].path, err.errors[key].value));
          });
          this.status = 422; // 422 Unprocessable Entity
          this.body = yield cU.body(msgJSONArray);
        
        // Image validation errors
        } else if (err.name === 'ImageError' && err.message) {
          this.status = 400;
          this.body = yield cU.body(cU.msg(err.message, 'validation', 'image'));
        }

      // non-validation errors
      } else {
        try {

          // record errors as Mongoose-modeled documents
          var _error = new _Error({ 
            method: this.method,
            params: typeof this.request.body !== 'undefined' ? _.omit(this.request.body, 'password') : {},
            referer: this.header.referer,
            stack: err.stack,
            status: err.status || 500,
            url: this.url,
            user: ( this.session && this.session.user ? ( this.session.user.id ? this.session.user.id  : this.session.user ) : null ),
            userIP: this.ip
          });
          yield Promise.promisify(_error.save, _error)();
        } catch (err) {
          // print error logging error to console, but do not overwrite original error
          console.failure(err.stack);
        }

        this.status = err.status || 500;
        this.body = yield cU.body(cU.msg(msg.status[err.status || 500], 'error'));
      }
    }
  }
}
