
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

module.exports = function (app) {
  
  // temporary test route
  app.get('/test-api/test.json', function *() {
    this.body = {
      name: 'brewGet',
      description: 'a node/koa app that facilitates the trading of beer'
    }
  })

  // beers
  app.get('/api/beers', beers.index);
  app.get('/api/beers/:brewery/:beer', beers.show);
  app.get('/api/breweries/:brewery/beers', beers.breweries.index);
  app.get('/api/locations/:state/beers', beers.locations.state);
  app.get('/api/locations/:state/:city/beers', beers.locations.city);
  app.get('/api/styles/:style/beers', beers.styles.index);

  // breweries
  app.get('/api/breweries', breweries.index);
  app.get('/api/breweries/:slug', breweries.show);

  // locations
  app.get('/api/locations', locations.index);
  app.get('/api/locations/:state', locations.state);
  app.get('/api/locations/:state/:city', locations.city);

  // navigation
  app.get('/api/nav', navigation);

  // posts
  app.get('/api/posts', posts.index);
  app.post('/api/posts', posts.create);

  // styles
  app.get('/api/styles', styles.index);
  app.get('/api/styles/:slug', styles.show);

  // users sessions
  app.post('/api/users/sign-in', users.sessions.create);
  app.delete('/api/users/sign-out', users.sessions.destroy);

  // users
  app.get('/api/users', users.index);
  app.post('/api/users', users.create);
  app.get('/api/users/:username', users.findOne, users.show);
  app.put('/api/users/:username', users.findOne, requires.self, users.update);
  app.delete('/api/users/:username', users.findOne, requires.self, users.destroy);
  app.post('/api/users/:username/images', users.findOne, requires.self, users.images.create);
  app.delete('/api/users/:username/images', users.findOne, requires.self, users.images.destroy);

  // redirect all remaining GET method routes to angular router
  app.get('*', function* () {
    this.redirect('/#!' + this.url);
  });
}
