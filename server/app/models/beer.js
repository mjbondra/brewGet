
/**
 * Module dependencies
 */
var cU = require('../../assets/lib/common-utilities')
  , mongoose = require('mongoose')
  , Promise = require('bluebird')
  , sanitize = require('../../assets/lib/sanitizer-extended')
  , Schema = mongoose.Schema;

var BeerSchema = new Schema(require('../../config/schemas').beer)
  , Brewery = mongoose.model('Brewery')
  , Style = mongoose.model('Style');

BeerSchema.index({ 'aliases.slug': 1, 'brewery.aliases.slug': 1, 'brewery.location.slug': 1 }, { unique: true });
BeerSchema.index({ 'brewery.location.country.slug': 1, 'brewery.location.state.slug': 1, 'brewery.location.city.slug': 1 });

/**
 * Pre-validation hook; Sanitizers
 */
BeerSchema.pre('validate', function (next) {
  this.processNest(next, 2);
});

/**
 * Pre-save hook
 */
BeerSchema.pre('save', function (next) {
  this.slug = cU.slug(this.name);
  if (this.isNew) this.aliases.push({ name: this.name, slug: this.slug });
  next();
});

/**
 * Methods
 */
BeerSchema.methods = {

  /**
   * Process style and brewery against their individual models; retreive existing, save new
   *
   * @param {function} next - function that calls next function
   * @param {number} limit - number of times the function can be called again to correct for async uniqueness errors
   * @param {number} [count=0] - number of times the function has been called
   */
  processNest: function (next, limit, count) {
    if (!count) count = 1;
    else count++;

    Promise.all([
      Promise.promisify(Brewery.findOne, Brewery)({
        'aliases.slug': cU.slug(this.brewery.name),
        'location.slug': cU.slug(this.brewery.location.name)
      }),
      Promise.promisify(Style.findOne, Style)({ 'aliases.slug': cU.slug(this.style.name) })
    ]).bind(this).spread(function (brewery, style) {
      if (!brewery) {
        brewery = new Brewery(this._doc.brewery);
        brewery = Promise.promisify(brewery.save, brewery)();
      }
      if (!style) {
        style = new Style(this._doc.style);
        style = Promise.promisify(style.save, style)();
      }
      return Promise.all([ brewery, style ]);
    }).spread(function (brewery, style) {
      if (brewery[0]) brewery = brewery[0];
      if (style[0]) style = style[0];
      this.brewery = brewery;
      this.style = style;
      next();
    }).catch(function (err) {
      if (err.name === 'RejectionError' && err.cause) err = err.cause;
      // pass error to next() if limit has been reached, or if the error is not an async-caused duplicate key error
      if (count >= limit || ( err.code !== 11000 && err.code !== 11001 )) return next(err);
      this.processNest(next, limit, count);
    });
  }
};

mongoose.model('Beer', BeerSchema);
