
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

  // authentication
  app.post('/api/users/sign-in', users.authenticate);
  app.delete('/api/users/sign-out', users.signOut);

  // users
  app.get('/api/users', users.index);
  app.post('/api/users/new', users.create);
  app.get('/api/users/:username', users.show);
  app.put('/api/users/:username', users.update);
  app.delete('/api/users/:username', users.destroy);

  // redirect all remaining GET method routes to angular router
  app.get('*', function* () {
    this.redirect('/#!' + this.url);
  });
}
