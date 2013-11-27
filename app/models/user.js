
/**
 * Module dependencies
 */

var crypto = require('crypto')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema;

/**
 * User schema
 */

/*var UserSchema = new Schema({
  username: { 
    type: String, 
    validate: [ validate.notNull, msg.username.isNull ], 
    index: { unique: true }
  },
  email: { 
    type: String, 
    validate: [
      { validator: validate.isEmail, msg: msg.email.notEmail },
      { validator: validate.notNull, msg: msg.email.isNull }
    ]
  },
  hash: String,
  salt: String,
  role: { type: String, default: 'user' },
  changeLog: [ ChangeLogSchema ]
});*/
