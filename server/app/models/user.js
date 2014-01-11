
/**
 * Module dependencies
 */
var check = require('../../assets/lib/mongoose-validator').check
  , crypto = require('crypto')
  , mongoose = require('mongoose')
  , msg = require('../../config/messages')
  , sanitize = require('validator').sanitize
  , Schema = mongoose.Schema
  , uid = require('uid2');

/**
 * User schema
 */
var UserSchema = new Schema({
  birthday: {
    type: Date,
    validate: [
      { validator: check.notNull, msg: msg.birthday.isNull },
      { validator: check.isDate, msg: msg.birthday.notDate },
      { validator: check.is21, msg: msg.birthday.not21 }
    ]
  },
  email: { 
    type: String, 
    validate: [
      { validator: check.notNull, msg: msg.email.isNull },
      { validator: check.isEmail, msg: msg.email.notEmail }
    ]
  },
  hash: String,
  location: String,
  role: { 
    type: Number, 
    default: 1 
  },
  salt: String,
  username: { 
    type: String, 
    validate: [ check.notNull, msg.username.isNull ], 
    index: { unique: true }
  }
});

/**
 * Virtuals
 */
UserSchema.virtual('password')
  .set(function (password) {
    if (!password && !this.isNew) return;
    this._password = sanitize(password).escape();
    this.salt = this.makeSalt();
    this.hash = this.encrypt(this._password, this.salt);
  })
  .get(function () { 
    return this._password; 
  });

/**
 * Pre-validation hook; Sanitizers
 */
UserSchema.pre('validate', function (next) {
  // ensure that password virtual exists on new User objects for validation purposes
  if (!this.password && this.isNew) this.password = null;

  this.email = sanitize(this.email).escape();
  this.location = sanitize(this.location).escape();
  this.username = sanitize(this.username).escape();
  next();
});

/**
 * Validations
 */
UserSchema.path('hash').validate(function (v) {
  if (!check.notNull(this._password) && this.isNew) {
    this.invalidate('password', msg.password.isNull);
  }
}, null);

/**
 * Methods 
 */
UserSchema.methods = {
  authenticate: function (plainText, salt) {
    return this.hash === this.encrypt(sanitize(plainText).escape(),salt);
  },
  encrypt: function (plainText, salt) {
    var hash = crypto.createHmac('sha512', salt)
      .update(plainText)
      .digest('base64');
    return hash;
  },
  makeSalt: function () {
    return uid(15);
  }
};

mongoose.model('User', UserSchema);
