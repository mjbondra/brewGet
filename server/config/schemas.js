
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
  city: {
    name: String,
    slug: String
  },
  country: {
    abbreviation: String,
    name: String,
    slug: String
  },
  geometry: {
    latitude: Number,
    longitude: Number
  },
  name: String,
  slug: String,
  state: {
    abbreviation: String,
    name: String,
    slug: String
  }
};

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
    location: this.location,
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
};
