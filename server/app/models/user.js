
/**
 * Module dependencies
 */
var check = require('../../assets/lib/mongoose-validator').check
  , crypto = require('crypto')
  , cU = require('../../assets/lib/common-utilities')
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
  _location: {
    city: String,
    state: String,
    latitude: Number,
    longitude: Number
  },
  role: { 
    type: Number, 
    default: 1 
  },
  salt: String,
  slug: String,
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
  // ensure that certain variables exists on new User objects for validation purposes
  if (!this.password && this.isNew) this.password = null;
  if (!this.birthday && this.isNew) this.birthday = null;

  // parse location strings -- they may be plain strings, or stringified Google Places API objects
  this.parseLocation(this.location);

  this.email = sanitize(this.email).escape();
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
 * Pre-save hook
 */
UserSchema.pre('save', function (next) {
  this.slug = cU.slug(this.username);
  next();
});

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
  },
  parseLocation: function (location) {
    try {
      location = JSON.parse(location);
      this.location = sanitize(location.formatted_address).escape();

      // latitude & longitude
      if (typeof location.latitude === 'number') this._location.latitude = location.latitude;
      if (typeof location.longitude === 'number') this._location.longitude = location.longitude;

      // city & state
      var i = location.address_components.length;
      while (i--) {
        if (location.address_components[i].types[0] === 'locality') this._location.city = sanitize(location.address_components[i].long_name).escape();
        else if (location.address_components[i].types[0] === 'administrative_area_level_1') this._location.state = sanitize(location.address_components[i].short_name).escape();
        else if (location.address_components[i].types[0] === 'country' && location.address_components[i].long_name !== 'United States') this.invalidate('location', msg.location.notUS);
      }
    } catch (err) {
      if (typeof this.location === 'string') this.location = sanitize(this.location).escape();
      else this.location = '';
    }
  }
};

mongoose.model('User', UserSchema);
