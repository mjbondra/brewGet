
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

module.exports = function (config) {
  try {
    mongoose.connect('mongodb://' + config.mongo.host + '/' + config.mongo.db);
    if (config.env === 'development') mongoose.set('debug', true);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {
      console.success('Connected to MongoDB', config.mongo);
    });
  } catch (err) {
    console.failure('There was an error while trying to connect to MongoDB', err.stack);
  }
}
