
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

/**
 * Location schema
 */
exports.location = {
  address: String,
  city: String,
  country: String,
  formatted_address: String,
  latitude: Number,
  longitude: Number,
  slug: {
    city: String,
    state: String
  },
  state: String
}

/**
 * Beer/Brewery schema
 */
exports.beer = {
  abv: Number,
  aliases: [{
    name: String,
    slug: String
  }],
  brewery: {
    aliases: [{
      name: String,
      slug: String
    }],
    comments: [ CommentSchema ],
    images: [ ImageSchema ],
    info: String,
    location: String,
    _location: this.location,
    name: String,
    rating: Number,
    slug: String
  },
  comments: [ CommentSchema ],
  ibu: Number,
  images: [ ImageSchema ],
  info: String,
  name: String,
  qty: [{
    count: Number,
    unit: String,
    volume: Number
  }],
  rating: Number,
  slug: String,
  style: {
    aliases: [{
      name: String,
      slug: String
    }],
    name: String,
    slug: String
  }
}
