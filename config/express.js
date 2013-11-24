
/**
 * Express core
 * 3.4.x
 */
var express = require('express');

/**
 * Module dependencies
 */
var mongoStore = require('connect-mongo')(express)
  , flash = require('connect-flash')
  , gzippo = require('gzippo');

module.exports = function (app, config, passport) {

  /** allow reverse proxying via nginx */
  app.enable('trust proxy');

  app.setMaxListeners(0);

  /** set port for listening; default to port 3000 */
  app.set('port', process.env.PORT || 3000);

  /** static content and compression */
  // app.use(express.favicon(config.root + '/public/favicon.ico', { maxAge: 86400000 })); add favicon
  app.use(gzippo.staticGzip(config.root + '/public', { maxAge: 86400000 }));

  /** stream compression */
  app.use(gzippo.compress());

  /** don't use logger for test env */
  if (process.env.NODE_ENV !== 'test') {
    app.use(express.logger('dev'));
  }

  app.use(express.cookieParser());
  app.use(express.json());
  app.use(express.urlencoded());
  // app.use(express.multipart()); use alternative parsing module for this
  app.use(express.methodOverride());

  /** express/mongo session storage */
  app.use(express.session({
    secret: config.sessionSecret,
    store: new mongoStore({
      url: 'mongodb://' + config.db.host + '/' + config.db.name,
      collection : 'sessions'
    })
  }));

}

