
/**
 * Module dependencies
 */
var requires = require('../lib/authorize').requires;

/**
 * Controllers
 */
var users = require('../app/controllers/users')
  , navigation = require('../app/controllers/navigation');

module.exports = function (app, passport) {

  /** navigation */
  app.get('/api/nav', navigation.items);

  /** authentication */
  app.post('/api/users/authenticate', users.authenticate(passport));
  app.get('/api/users/logout', users.logout);

  /** users */
  app.get('/api/users', users.index);
  app.post('/api/users/new', users.create);

  /** redirect all remaining routes to angular router */
  app.get('*', function (req, res, next) {
    res.redirect('/#!' + req.url);
  });
}
