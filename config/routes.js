/**
 * Controllers
 */
var users = require('../app/controllers/users')
  , navigation = require('../app/controllers/navigation');

module.exports = function (app, passport) {
  app.get('/test', function (req, res, next) {
    res.json({ this: 'works', test: req.body });
  });

  app.get('/nav', navigation.items);

  app.get('/users', users.index);
  app.post('/users/new', users.create);
}
