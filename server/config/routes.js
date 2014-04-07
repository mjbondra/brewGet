
/**
 * Middleware
 */
var requires = require('../app/middleware/auth').requires;

/**
 * Controllers
 */
var beers = require('../app/controllers/beers')
  , breweries = require('../app/controllers/breweries')
  , locations = require('../app/controllers/locations')
  , navigation = require('../app/controllers/navigation')
  , posts = require('../app/controllers/posts')
  , styles = require('../app/controllers/styles')
  , users = require('../app/controllers/users');

module.exports = function (app, socketEmitter) {

  // temporary test route
  app.get('/test-api/test.json', function *() {
    this.body = {
      name: 'brewGet',
      description: 'a node/koa app that facilitates the trading of beer'
    };
  });

  // beers
  app.get('/api/beers', beers.index);
  app.get('/api/beers/_id/:id', beers.show);
  app.get('/api/beers/:country', beers.index);
  app.get('/api/beers/:country/:state', beers.index);
  app.get('/api/beers/:country/:state/:city', beers.index);
  app.get('/api/beers/:country/:state/:city/:brewery', beers.index);
  app.get('/api/beers/:country/:state/:city/:brewery/:beer', beers.show);

  // breweries
  app.get('/api/breweries', breweries.index);
  app.get('/api/breweries/_id/:id', breweries.show);
  app.get('/api/breweries/:country', breweries.index);
  app.get('/api/breweries/:country/:state', breweries.index);
  app.get('/api/breweries/:country/:state/:city', breweries.index);
  app.get('/api/breweries/:country/:state/:city/:brewery', breweries.show);

  // locations
  app.get('/api/locations', locations.index);
  app.get('/api/locations/_id/:id', locations.show);
  app.get('/api/locations/:country', locations.index);
  app.get('/api/locations/:country/:state', locations.index);
  app.get('/api/locations/:country/:state/:city', locations.show);

  // navigation
  app.get('/api/nav', navigation);

  // posts
  app.get('/api/posts', posts.index);
  app.post('/api/posts', posts.create);

  // styles
  app.get('/api/styles', styles.index);
  app.get('/api/styles/:slug', styles.show);

  // users sessions
  app.post('/api/users/sign-in', users.sessions.update(socketEmitter), users.sessions.create);
  app.delete('/api/users/sign-out', users.sessions.update(socketEmitter), users.sessions.destroy);

  // users
  app.get('/api/users', users.index);
  app.post('/api/users', users.sessions.update(socketEmitter), users.create);
  app.get('/api/users/:username', users.findOne, users.show);
  app.put('/api/users/:username', users.findOne, requires.self, users.sessions.update(socketEmitter), users.update);
  app.delete('/api/users/:username', users.findOne, requires.self, users.sessions.update(socketEmitter), users.destroy);
  app.post('/api/users/:username/images', users.findOne, requires.self, users.sessions.update(socketEmitter), users.images.create);
  app.delete('/api/users/:username/images', users.findOne, requires.self, users.sessions.update(socketEmitter), users.images.destroy);

  // redirect all remaining GET method routes to angular router
  app.get('*', function *() {
    this.redirect('/#!' + this.url);
  });
};
