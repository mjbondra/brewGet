
/**
 * Module dependencies
 */
var logger = require('koa-logger')
  , mongoose = require('mongoose')
  , mongoStore = require('koa-session-mongo')
  , router = require('koa-router')
  , session = require('koa-session-store')
  , static = require('koa-static');

/**
 * Middleware
 */
var auth = require('../app/middleware/auth')
  , bodyParser = require('../app/middleware/body-parser')
  , error = require('../app/middleware/error');

module.exports = function (app, config, veritable) {

  // collapse JSON responses
  app.jsonSpaces = 0;

  // logger 
  app.use(logger());

  // static files 
  app.use(static(config.root + '/client'));

  // sessions 
  app.keys = config.secrets;
  app.use(session({
    store: mongoStore.create({
      mongoose: mongoose.connection
    })
  }));
  
  // body parser 
  app.use(bodyParser());

  // routes 
  app.use(router(app));

  // errors
  app.use(error.respond());
  app.use(error.log());
  app.use(error.validate());

}
