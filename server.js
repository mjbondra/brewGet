
/**
 *                     ___           ___           ___           ___           ___                 
 *      _____         /  /\         /  /\         /__/\         /  /\         /  /\          ___   
 *     /  /::\       /  /::\       /  /:/_       _\_ \:\       /  /:/_       /  /:/_        /  /\  
 *    /  /:/\:\     /  /:/\:\     /  /:/ /\     /__/\ \:\     /  /:/ /\     /  /:/ /\      /  /:/  
 *   /  /:/~/::\   /  /:/~/:/    /  /:/ /:/_   _\_ \:\ \:\   /  /:/_/::\   /  /:/ /:/_    /  /:/   
 *  /__/:/ /:/\:| /__/:/ /:/___ /__/:/ /:/ /\ /__/\ \:\ \:\ /__/:/__\/\:\ /__/:/ /:/ /\  /  /::\   
 *  \  \:\/:/~/:/ \  \:\/:::::/ \  \:\/:/ /:/ \  \:\ \:\/:/ \  \:\ /~~/:/ \  \:\/:/ /:/ /__/:/\:\  
 *   \  \::/ /:/   \  \::/~~~~   \  \::/ /:/   \  \:\ \::/   \  \:\  /:/   \  \::/ /:/  \__\/  \:\ 
 *    \  \:\/:/     \  \:\        \  \:\/:/     \  \:\/:/     \  \:\/:/     \  \:\/:/        \  \:\
 *     \  \::/       \  \:\        \  \::/       \  \::/       \  \::/       \  \::/          \__\/
 *      \__\/         \__\/         \__\/         \__\/         \__\/         \__\/                
 *
 */

/**
 * Express core
 * 3.x
 */
var express = require('express')
  , app = express();

/**
 * Module dependencies
 */
var fs = require('fs')
  , io = require('socket.io')
  , mongoose = require('mongoose')
  , passport = require('passport');

/** use environment-specific configuration; default to 'development' if unspecified */
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env];

/** db connection */
mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name);
if (env === 'development') mongoose.set('debug', true);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('Connected to MongoDB -- host: ' + config.db.host + ', name: ' + config.db.name);
});

/** load document models */
var modelsPath = __dirname + '/app/models'
fs.readdirSync(modelsPath).forEach(function (file) {
  if (~file.indexOf('.js')) require(modelsPath + '/' + file);
});

/** Express configuration */
require('./config/express')(app, config, passport);

/** routes configuration */
require('./config/routes')(app, passport);

/** bind and listen for connections */
io.listen(app.listen(app.get('port')));
console.log('Listening on port ' + app.get('port'));
