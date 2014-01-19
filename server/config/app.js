
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
  , notFound = require('../app/middleware/404')
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

  // error handling middleware
  app.use(error());

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
  app.use(bodyParser({
    busboy: {
      limits: {
        fields: 20,
        files: 10,
        fileSize: 2097152, // 2 MB
        parts: 20     
      }
    },
    types: [
      'image/png',
      'image/jpeg',
      'image/gif'
    ],
    uploadDir: config.path.tmp
  }));

  // routes 
  app.use(router(app));

  // 404 Not Found
  app.use(notFound());
}
