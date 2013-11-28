
/**
 * Module dependencies
 */
var crypto = require('crypto')
  , mongoose = require('mongoose')
  , msg = require('../../config/messages')
  , sanitize = require('validator').sanitize
  , Schema = mongoose.Schema
  , validate = require('../../utils').check;

/**
 * User schema
 */
var UserSchema = new Schema({
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
  role: { 
    type: String, 
    default: 'user' 
  }
});

/**
 * Virtuals
 */
UserSchema.virtual('password')
  .set(function(password) {
    if (!password && !this.isNew) return;
    this._password = sanitize(password).escape();
    this.salt = this.makeSalt();
    this.hash = this.encrypt(this._password, this.salt);
  })
  .get(function() { 
    return this._password; 
  });

UserSchema.virtual('_meta')
  .set(function(metaData) {
    this.__meta = metaData;
  })
  .get(function() { 
    return this.__meta; 
  });

/**
 * Pre-validation hook; Sanitizers
 */
UserSchema.pre('validate', function(next) {
  this.username = sanitize(this.username).escape();
  this.email = sanitize(this.email).escape();
  next();
});

/**
 * Validations
 */
UserSchema.path('hash').validate(function(v){
  if (!validate.notNull(this._password) && this.isNew) {
    this.invalidate('password', msg.password.isNull);
  }
}, null);

/**
 * Methods 
 */
UserSchema.methods = {
  authenticate: function(plainText,salt) {
    return this.hash === this.encrypt(sanitize(plainText).escape(),salt);
  },
  encrypt: function(plainText,salt) {
    var hash = crypto.createHmac("sha512", salt)
      .update(plainText)
      .digest("base64");
    return hash;
  },
  makeSalt: function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  }
};

mongoose.model('User', UserSchema);
