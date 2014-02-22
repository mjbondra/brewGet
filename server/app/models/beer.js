
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
  var nestedDocs = [];
  if (this.brewery && this.brewery.name) {
    this.brewery.slug = cU.slug(this.brewery.name);
    nestedDocs.push(Promise.promisify(Brewery.findOne, Brewery)({ slug: this.brewery.slug }));
  }
  if (this.style && this.style.name) {
    this.style.slug = cU.slug(this.style.name);
    nestedDocs.push(Promise.promisify(Style.findOne, Style)({ slug: this.style.slug }));
  } 
  
  // if (this.brewery && this.brewery.name) {
  //   this.brewery.slug = cU.slug(this.brewery.name);
  //   Promise.promisify(Brewery.findOne, Brewery)({ slug: this.brewery.slug }).bind(this).then(function (brewery) {
  //     if (!brewery) {
  //       brewery = new Brewery(this._doc.brewery);
  //       Promise.promisify(brewery.save, brewery)().bind(this).then(function (brewery) {
  //         this.brewery = brewery[0];
  //         next();
  //       }).catch(function (err) {
  //         next();
  //       });
  //     } else {
  //       this.brewery = brewery;
  //       next();
  //     }
  //   }).catch(function (err) {
  //     next();
  //   });
  // } else next();
});

/**
 * Pre-save hook
 */
BeerSchema.pre('save', function (next) {
  next();
});

mongoose.model('Beer', BeerSchema);
