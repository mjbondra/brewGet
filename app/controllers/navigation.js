
/**
 * Module dependencies
 */
var mongoose = require('mongoose');

/**
 * Items
 * GET /nav
 */
exports.items = function (req, res, next) {
  var nav = {
    content: [
      {
        title: 'Posts',
        href: '/'
      },
      {
        title: 'Users',
        href: '/users'
      },
      {
        title: 'Beers',
        href: '/beers'
      },
      {
        title: 'Breweries',
        href: '/breweries'
      }
    ],
    actions: [
      {
        title: 'Sign up',
        href: '/users/new'
      },
      {
        title: 'Sign in',
        href: '/users/auth'
      }
    ]
  };
  res.json(nav);
}
