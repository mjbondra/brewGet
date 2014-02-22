
/**
 * Module dependencies
 */
var cU = require('../../assets/lib/common-utilities')
  , mongoose = require('mongoose')
  , Promise = require('bluebird')
  , Schema = mongoose.Schema;

var BeerSchema = new Schema(require('../../config/schemas').beer)
  , Brewery = mongoose.model('Brewery')
  , Style = mongoose.model('Style');

BeerSchema.index({ slug: 1, 'brewery.slug': 1 }, { unique: true });

/**
 * Pre-validation hook; Sanitizers
 */
BeerSchema.pre('validate', function (next) {
  next();
});

/**
 * Pre-save hook
 */
BeerSchema.pre('save', function (next) {
  this.slug = cU.slug(this.name);
  if (this.isNew) this.aliases.push({ name: this.name, slug: this.slug });

  // process validated style and brewery against their individual models; retreive existing, save new
  Promise.all([
    Promise.promisify(Brewery.findOne, Brewery)({ slug: cU.slug(this.brewery.name) }),
    Promise.promisify(Style.findOne, Style)({ slug: cU.slug(this.style.name) })
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
    next();
  });

});

mongoose.model('Beer', BeerSchema);
