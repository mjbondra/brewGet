
/**
 * Module dependencies
 */
var crypto = require('crypto')
  , cU = require('../../assets/lib/common-utilities')
  , mongoose = require('mongoose')
  , msg = require('../../config/messages')
  , Promise = require('bluebird')
  , sanitize = require('../../assets/lib/sanitizer-extended')
  , Schema = mongoose.Schema
  , uid = require('uid2')
  , validate = require('../../assets/lib/validator-extended');

/**
 * Schema dependencies; subdocuments
 */
var ImageSchema = mongoose.model('Image').schema
  , Location = mongoose.model('Location')
  , LocationSchema = require('../../config/schemas').location;

/**
 * User schema
 */
var UserSchema = new Schema({
  birthday: {
    type: Date,
    validate: [
      { validator: validate.over21, msg: msg.birthday.under21 },
      { validator: validate.isDate, msg: msg.birthday.notDate },
      { validator: validate.notNull, msg: msg.birthday.isNull }
    ]
  },
  email: {
    type: String,
    validate: [
      { validator: validate.isEmail, msg: msg.email.notEmail },
      { validator: validate.notNull, msg: msg.email.isNull }
    ]
  },
  hash: String,
  images: [ ImageSchema ],
  location: LocationSchema,
  role: {
    type: Number,
    default: 1
  },
  salt: String,
  slug: {
    type: String,
    index: { unique: true }
  },
  username: {
    type: String,
    validate: [
      { validator: validate.notNull, msg: msg.username.isNull }
    ]
  }
});

/**
 * Virtuals
 */
UserSchema.virtual('password')
  .set(function (password) {
    if (!password && !this.isNew) return;
    this._password = sanitize.escape(password);
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

  this.email = sanitize.escape(this.email);
  this.username = sanitize.escape(this.username);

  this.processNest(next, 2);
});

/**
 * Validations
 */
UserSchema.path('hash').validate(function (v) {
  if (validate.isNull(this._password) && this.isNew) {
    this.invalidate('password', msg.password.isNull);
  }
}, null);

/**
 * Pre-save hook
 */
UserSchema.pre('save', function (next) {
  this.slug = cU.slug(this.username, true);
  next();
});

/**
 * Methods
 */
UserSchema.methods = {
  authenticate: function (plainText, salt) {
    return this.hash === this.encrypt(sanitize.escape(plainText), salt);
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

  /**
   * Process location against the location model; retreive existing, save new
   *
   * Locations may be plain strings, or stringified Google Places API objects
   *
   * @param {function} next - function that calls next function
   * @param {number} limit - number of times the function can be called again to correct for async uniqueness errors
   * @param {number} [count=0] - number of times the function has been called
   */
  processNest: function (next, limit, count) {
    if (!count) count = 1;
    else count++;

    if (typeof this._doc.location === 'string') this.location = {
      name: this._doc.location
    };
    if (!this.location.name) {
      this.location = {};
      return next();
    }

    Promise.promisify(Location.findOne, Location)({ slug: cU.slug(this.location.name) }).bind(this).then(function (location) {
      if (location) return location;
      location = new Location(this._doc.location);
      if (!location.country.abbreviation || !location.state.abbreviation || !location.city.name) return {
        name: sanitize.escape(location.name),
        slug: cU.slug(sanitize.escape(location.name))
      };
      return Promise.promisify(location.save, location)();
    }).then(function (location) {
      if (location[0]) location = location[0];
      this.location = location;
      next();
    }).catch(function (err) {
      if (err.name === 'RejectionError' && err.cause) err = err.cause;
      // pass error to next() if limit has been reached, or if the error is not an async-caused duplicate key error
      if (count >= limit || ( err.code !== 11000 && err.code !== 11001 )) return next(err);
      this.processNest(next, limit, count);
    });
  }
};

mongoose.model('User', UserSchema);
