
/**
 * Middleware
 */
var requires = require('../app/middleware/auth').requires;

/**
 * Controllers
 */
var locations = require('../app/controllers/locations')
  , navigation = require('../app/controllers/navigation')
  , posts = require('../app/controllers/posts')
  , users = require('../app/controllers/users');

module.exports = function (app) {
  
  // temporary test route
  app.get('/test-api/test.json', function *() {
    this.body = {
      "name": "brewGet",
      "description": "a node/koa app that facilitates the trading of beer"
    }
  })

  // navigation
  app.get('/api/nav', navigation);

  // users sessions
  app.post('/api/users/sign-in', users.sessions.create);
  app.delete('/api/users/sign-out', users.sessions.destroy);

  // posts
  app.get('/api/posts', posts.index);
  app.post('/api/posts', posts.create);

  // users
  app.get('/api/users', users.index);
  app.post('/api/users', users.create);
  app.get('/api/users/:slug', users.show);
  app.put('/api/users/:slug', requires.self, users.update);
  app.delete('/api/users/:slug', requires.self, users.destroy);
  app.post('/api/users/:slug/images', requires.self, users.images.create);
  app.delete('/api/users/:slug/images', requires.self, users.images.destroy);

  // locations
  app.get('/api/locations', locations.index);
  app.get('/api/locations/:state', locations.state);
  app.get('/api/locations/:state/:city', locations.city);

  // redirect all remaining GET method routes to angular router
  app.get('*', function* () {
    this.redirect('/#!' + this.url);
  });
}
