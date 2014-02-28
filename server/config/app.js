
/**
 * Module dependencies
 */
var compress = require('koa-compress')
  , logger = require('koa-logger')
  , mongoose = require('mongoose')
  , mongooseStore = require('koa-session-mongoose')
  , router = require('koa-router')
  , session = require('koa-session-store')
  , static = require('koa-static');

/**
 * Middleware
 */
var autocomplete = require('./autocomplete-routes')
  , error = require('../app/middleware/error')
  , notFound = require('../app/middleware/404')
  , user = require('../app/controllers/users').sessions.show;

module.exports = function (app, config) {

  // collapse JSON responses
  app.jsonSpaces = 0;

  // logger
  if (config.env !== 'test') app.use(logger());

  // compression
  app.use(compress());

  // error handling middleware
  app.use(error());

  // static files 
  app.use(static(config.path.static));

  // autocomplete routes; before sessions middleware
  app.use(autocomplete.middleware());

  // sessions 
  app.keys = config.secrets;
  app.use(session({
    cookie: {
      maxage: 1000 * 60 * 60 * 24 * 14 // 2 weeks
    },
    store: mongooseStore.create()
  }));
  app.use(user());

  // api routes 
  app.use(router(app));

  // 404 Not Found
  app.use(notFound());
}
