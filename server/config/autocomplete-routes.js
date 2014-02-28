
/**
 * Middleware
 */
var Router = require('koa-router')
  , routes = new Router();

/**
 * Controllers
 */
var beers = require('../app/controllers/beers')
  , breweries = require('../app/controllers/breweries')
  , styles = require('../app/controllers/styles')
  , users = require('../app/controllers/users');

/**
 * Autocomplete router; separate from primary router to avoid session queries
 */
routes.get('/api/autocomplete/beers/:beer', beers.autocomplete);
routes.get('/api/autocomplete/breweries/:brewery', breweries.autocomplete);
routes.get('/api/autocomplete/styles/:style', styles.autocomplete);
routes.get('/api/autocomplete/users/:user', users.autocomplete);

module.exports = routes;
