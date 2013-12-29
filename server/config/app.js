
/**
 * Module dependencies
 */
var logger = require('koa-logger')
  , mongoose = require('mongoose')
  // , mongoStore = require('koa-session-mongo')
  , router = require('koa-router')
  , session = require('koa-session')
  // , session = require('koa-session-store')
  , static = require('koa-static');

/**
 * Middleware
 */
var bodyParser = require('../app/middleware/body-parser')
  , error = require('../app/middleware/error')
  , user = require('../app/controllers/users').deserialize;

module.exports = function (app, config) {

  // collapse JSON responses
  app.jsonSpaces = 0;

  // logger
  if (config.env !== 'test') app.use(logger());

  // static files 
  app.use(static(config.path.static));

  // sessions 
  app.keys = config.secrets;
  app.use(session());
  // app.use(session({
  //   store: mongoStore.create({
  //     mongoose: mongoose.connection
  //   })
  // }));
  app.use(user());
  
  // body parser 
  app.use(bodyParser(config));

  // routes 
  app.use(router(app));

  // errors
  app.use(error.respond());
  app.use(error.log());
  app.use(error.validate());

}
