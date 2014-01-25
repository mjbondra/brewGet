
/**
 * Middleware
 */
var requires = require('../app/middleware/auth').requires;

/**
 * Controllers
 */
var navigation = require('../app/controllers/navigation')
  , users = require('../app/controllers/users');

module.exports = function (app) {
  
  // temporary test route
  app.get('/test-api/test.json', function *() {
    this.body = {
      "name": "brewGet",
      "description": "a node/express app that facilitates the trading of beer"
    }
  })

  // navigation
  app.get('/api/nav', navigation.items)

  // users sessions
  app.post('/api/users/sign-in', users.sessions.create);
  app.delete('/api/users/sign-out', users.sessions.destroy);

  // users
  app.get('/api/users', users.index);
  app.post('/api/users', users.create);
  app.get('/api/users/:username', users.show);
  app.put('/api/users/:username', requires.self, users.update);
  app.delete('/api/users/:username', requires.self, users.destroy);
  app.post('/api/users/:username/images', requires.self, users.images.create);
  app.delete('/api/users/:username/images', requires.self, users.images.destroy);

  // redirect all remaining GET method routes to angular router
  app.get('*', function* () {
    this.redirect('/#!' + this.url);
  });
}
