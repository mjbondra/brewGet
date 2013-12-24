
/**
 * Module dependencies
 */
var logger = require('koa-logger')
  , router = require('koa-router')
  , session = require('koa-session')
  , static = require('koa-static');

/**
 * Middleware
 */
var bodyParser = require('../app/middleware/body-parser')
  , error = require('../app/middleware/error');

module.exports = function (app, config) {

  // collapse JSON responses
  app.jsonSpaces = 0;

  // logger 
  app.use(logger());

  // sessions 
  app.keys = config.secrets;
  app.use(session());

  // static files 
  app.use(static(config.root + '/client'));

  // body parser 
  app.use(bodyParser());

  // routes 
  app.use(router(app));

  // errors
  app.use(error.respond());
  app.use(error.log());
  app.use(error.validate());

}
