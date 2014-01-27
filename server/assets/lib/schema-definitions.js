
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
var ImageSchema = mongoose.model('Image').schema
  , CommentSchema = mongoose.model('Comment').schema;

module.exports = {
  beer: {
    abv: Number,
    brewery: {
      comments: [ CommentSchema ],
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
    },
    comments: [ CommentSchema ],
    ibu: Number,
    images: [ ImageSchema ],
    info: String,
    name: String,
    slug: String,
    style: String
  }
}
