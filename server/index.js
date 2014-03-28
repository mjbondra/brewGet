
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
 * Koa core
 * 0.x
 */
var koa = require('koa')
  , app = koa();

// use environment-specific configuration; default to 'development' if unspecified
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env];

// SockJS EventEmitter
var events = require('events')
  , socketEmitter = new events.EventEmitter();

// global utilities
require('./assets/lib/console-utilities');

// mongo configuration and connection
require('./config/mongo')(config);

// models
require('./config/models')(__dirname + '/app/models/');

// koa configuration
require('./config/app')(app, config);

// server routes
require('./config/routes')(app, socketEmitter);

// socket configuration
require('./config/socket')(socketEmitter);

// listen
app.listen(config.port, function () {
  console.success('Listening for Connections', { port: config.port });
});
