'use strict';

  ////////////
 // ROUTES //
////////////

var app = angular.module('brewGet.routes', []);

/** 
 * Routes 
 */
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('!');

  $routeProvider.when('/', {
    templateUrl: '/app/views/home.html',
    controller: 'HomeCtrl'
  });

  // user / account routes
  $routeProvider.when('/users', {
    templateUrl: '/app/views/users/index.html',
    controller: 'users.index'
  });
  $routeProvider.when('/users/:username', {
    templateUrl: '/app/views/users/show.html',
    controller: 'users.show'
  });
  $routeProvider.when('/account/sign-up', {
    templateUrl: '/app/views/users/new.html',
    controller: 'users.new'
  });
  $routeProvider.when('/account/settings', {
    templateUrl: '/app/views/users/edit.html',
    controller: 'users.edit'
  });
  $routeProvider.when('/account/activity', {
    templateUrl: '/app/views/users/activity.html',
    controller: 'users.activity'
  });
  $routeProvider.when('/account/sign-in', {
    templateUrl: '/app/views/users/session.html',
    controller: 'users.session'
  });
  $routeProvider.when('/account/sign-out', {
    resolve: {
      response: ['User', function (User) {
        User.signOut();
      }]
    }
  });

  // post routes
  $routeProvider.when('/posts', {
    templateUrl: '/app/views/posts/index.html',
    controller: 'posts.index'
  });
  $routeProvider.when('/posts/new', {
    templateUrl: '/app/views/posts/new.html',
    controller: 'posts.new'
  });
  $routeProvider.when('/posts/:post', {
    templateUrl: '/app/views/posts/show.html',
    controller: 'posts.show'
  });
  $routeProvider.when('/posts/:post/edit', {
    templateUrl: '/app/views/posts/edit.html',
    controller: 'posts.edit'
  });

  // message routes
  $routeProvider.when('/account/inbox', {
    templateUrl: '/app/views/messages/index.html',
    controller: 'messages.index'
  });
  $routeProvider.when('/messages/new', {
    templateUrl: '/app/views/messages/new.html',
    controller: 'messages.new'
  });
  $routeProvider.when('/messages/:message', {
    templateUrl: '/app/views/messages/show.html',
    controller: 'messages.show'
  });
  $routeProvider.when('/messages/:message/edit', {
    templateUrl: '/app/views/messages/edit.html',
    controller: 'messages.edit'
  });

  // beer routes
  $routeProvider.when('/beers', {
    templateUrl: '/app/views/beers/index.html',
    controller: 'beers.index'
  });
  $routeProvider.when('/beers/new', {
    templateUrl: '/app/views/beers/new.html',
    controller: 'beers.new'
  });
  $routeProvider.when('/beers/:brewery/:beer', {
    templateUrl: '/app/views/beers/show.html',
    controller: 'beers.show'
  });
  $routeProvider.when('/beers/:brewery/:beer/edit', {
    templateUrl: '/app/views/beers/edit.html',
    controller: 'beers.edit'
  });

  // brewery routes
  $routeProvider.when('/breweries', {
    templateUrl: '/app/views/breweries/index.html',
    controller: 'breweries.index'
  });
  $routeProvider.when('/breweries/new', {
    templateUrl: '/app/views/breweries/new.html',
    controller: 'breweries.new'
  });
  $routeProvider.when('/breweries/:brewery', {
    templateUrl: '/app/views/breweries/show.html',
    controller: 'breweries.show'
  });
  $routeProvider.when('/breweries/:brewery/edit', {
    templateUrl: '/app/views/breweries/edit.html',
    controller: 'breweries.edit'
  });

  // location routes
  $routeProvider.when('/locations', {
    templateUrl: '/app/views/locations/index.html',
    controller: 'locations.index'
  });
  $routeProvider.when('/locations/new', {
    templateUrl: '/app/views/locations/new.html',
    controller: 'locations.new'
  });
  $routeProvider.when('/locations/:state', {
    templateUrl: '/app/views/locations/index.html',
    controller: 'locations.index'
  });
  $routeProvider.when('/locations/:state/:city', {
    templateUrl: '/app/views/locations/show.html',
    controller: 'locations.show'
  });
  $routeProvider.when('/locations/:state/:city/edit', {
    templateUrl: '/app/views/locations/edit.html',
    controller: 'locations.edit'
  });

  // style routes
  $routeProvider.when('/styles', {
    templateUrl: '/app/views/styles/index.html',
    controller: 'styles.index'
  });
  $routeProvider.when('/styles/new', {
    templateUrl: '/app/views/styles/new.html',
    controller: 'styles.new'
  });
  $routeProvider.when('/styles/:style', {
    templateUrl: '/app/views/styles/show.html',
    controller: 'styles.show'
  });
  $routeProvider.when('/styles/:style/edit', {
    templateUrl: '/app/views/styles/edit.html',
    controller: 'styles.edit'
  });

  // default route
  $routeProvider.otherwise({ 
    redirectTo: '/'
  });
}]);
