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
  $routeProvider.when('/users/:slug', {
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
  $routeProvider.when('/posts/:slug', {
    templateUrl: '/app/views/posts/show.html',
    controller: 'posts.show'
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
  $routeProvider.when('/messages/:slug', {
    templateUrl: '/app/views/messages/show.html',
    controller: 'messages.show'
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
  $routeProvider.when('/beers/:slug', {
    templateUrl: '/app/views/beers/show.html',
    controller: 'beers.show'
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
  $routeProvider.when('/breweries/:slug', {
    templateUrl: '/app/views/breweries/show.html',
    controller: 'breweries.show'
  });

  // default route
  $routeProvider.otherwise({ 
    redirectTo: '/'
  });
}]);
