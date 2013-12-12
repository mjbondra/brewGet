
/**
 * Express core
 * 3.x
 */
var express = require('express');

/**
 * Module dependencies
 */
var mongoStore = require('connect-mongo')(express)
  , flash = require('connect-flash');

/**
 * Middleware
 */
var error = require('../app/middleware/error')
  , helper = require('../app/middleware/helper');


module.exports = function (app, config, passport) {

  /** allow reverse proxying via nginx */
  app.enable('trust proxy');

  /** set max listeners */
  app.setMaxListeners(0);

  /** set port for listening; default to port 3000 */
  app.set('port', process.env.PORT || 3000);

  /** don't use logger for test env */
  if (process.env.NODE_ENV !== 'test') {
    app.use(express.logger('dev'));
  }

  /** compression and static content */
  app.use(express.compress());
  app.use(express.static(config.root + '/public'));

  app.use(express.cookieParser(config.secrets.cookie));
  app.use(express.json());
  app.use(express.urlencoded());
  // app.use(express.multipart()); use alternative parsing module for this
  app.use(express.methodOverride());

  /** express/mongo session storage */
  app.use(express.session({
    secret: config.secrets.session,
    store: new mongoStore({
      url: 'mongodb://' + config.db.host + '/' + config.db.name,
      collection : 'sessions'
    })
  }));

  /** use passport session */
  app.use(passport.initialize());
  app.use(passport.session());

  /** use flash for messages */
  app.use(flash());

  app.use(helper.functions);
  app.use(app.router);
  app.use(error.validation);
  app.use(error.log);
  app.use(error.respond);
}

