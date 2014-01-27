
/**
 * This module provides reusable schemas to support denormalized MongoDB documents through Mongoose models
 */

/**
 * Module dependencies
 */
var mongoose = require('mongoose');

/**
 * Schema dependencies; subdocuments
 */
var ImageSchema = mongoose.model('Image').schema;

module.exports = {
  beer: {
    abv: Number,
    ibu: Number,
    images: [ ImageSchema ],
    info: String,
    name: String,
    slug: String,
    brewery: {
      images: [ ImageSchema ],
      info: String,
      location: String,
      _location: {
        address: String,
        city: String,
        country: String,
        latitude: Number,
        longitude: Number,
        state: String
      },
      name: String
    }
  }
}
