
/**
 * Module dependencies
 */
var compress = require('koa-compress')
  , logger = require('koa-logger')
  , mongoose = require('mongoose')
  , mongooseStore = require('koa-session-mongoose')
  , router = require('koa-router')
  , session = require('koa-session-store')
  , static = require('koa-static-cache');

/**
 * Middleware
 */
var bodyParser = require('../app/middleware/body-parser')
  , error = require('../app/middleware/error')
  , pathRewrite = require('../app/middleware/path-rewrite')
  , user = require('../app/controllers/users').session;

module.exports = function (app, config) {

  // collapse JSON responses
  app.jsonSpaces = 0;

  // logger
  if (config.env !== 'test') app.use(logger());

  app.use(compress());

  // static files 
  app.use(pathRewrite('/', '/index.html'));
  app.use(static(config.path.static));

  // sessions 
  app.keys = config.secrets;
  app.use(session({
    cookie: {
      maxage: 1000 * 60 * 60 * 24 * 14 // 2 weeks
    },
    store: mongooseStore.create()
  }));
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
