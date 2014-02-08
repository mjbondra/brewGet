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

  // user routes
  $routeProvider.when('/users', {
    templateUrl: '/app/views/users/index.html',
    controller: 'user.index'
  });
  $routeProvider.when('/users/:slug', {
    templateUrl: '/app/views/users/show.html',
    controller: 'user.show'
  });

  // account routes
  $routeProvider.when('/account/sign-up', {
    templateUrl: '/app/views/account/sign-up.html',
    controller: 'account.signup'
  });
  $routeProvider.when('/account/settings', {
    templateUrl: '/app/views/account/settings.html',
    controller: 'account.settings'
  });
  $routeProvider.when('/account/sign-in', {
    templateUrl: '/app/views/account/sign-in.html',
    controller: 'account.signin'
  });
  $routeProvider.when('/account/sign-out', {
    resolve: {
      response: ['User', function (User) {
        User.signOut();
      }]
    }
  });

  // default route
  $routeProvider.otherwise({ 
    redirectTo: '/'
  });
}]);
