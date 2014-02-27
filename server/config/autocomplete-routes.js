
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
module.exports = function () {
  return function *(next) {
    var match = this.path.match(new RegExp('\/api\/autocomplete\/(.*)\/(.*)'));
    if (!match) return yield next;
    this.params = {};
    switch (match[1]) {
      case 'beers':
        this.params.beer = match[2];
        yield beers.autocomplete;
        break;
      case 'breweries':
        this.params.brewery = match[2];
        yield breweries.autocomplete;
        break;
      case 'styles':
        this.params.style = match[2];
        yield styles.autocomplete;
        break;
      case 'users':
        this.params.user = match[2];
        yield users.autocomplete;
        break;
      default:
        yield next;
    }
  }
}
