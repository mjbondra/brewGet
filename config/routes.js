/**
 * Controllers
 */
var users = require('../app/controllers/users')
  , navigation = require('../app/controllers/navigation');

module.exports = function (app, passport) {
  app.get('/test', function (req, res, next) {
    res.json({ this: 'works', test: req.body });
  });

  /** navigation */
  app.get('/api/nav', navigation.items);

  /** users */
  app.get('/api/users', users.index);
  app.post('/api/users/new', users.create);

  /** redirect all remaining routes to angular router */
  app.get('*', function (req, res, next) {
    res.redirect('/#!' + req.url);
  });
}
