
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
  app.post('/api/users/sign-in', users.signIn(passport));
  app.get('/api/users/sign-out', users.signOut);

  /** users */
  app.get('/api/users', users.index);
  app.post('/api/users/new', users.create);

  /** redirect all remaining routes to angular router */
  app.get('*', function (req, res, next) {
    res.redirect('/#!' + req.url);
  });
}
