'use strict';

/**
 *                     ___           ___           ___           ___           ___                 
 *      _____         /  /\         /  /\         /__/\         /  /\         /  /\          ___   
 *     /  /::\       /  /::\       /  /:/_       _\_ \:\       /  /:/_       /  /:/_        /  /\  
 *    /  /:/\:\     /  /:/\:\     /  /:/ /\     /__/\ \:\     /  /:/ /\     /  /:/ /\      /  /:/  
 *   /  /:/~/::\   /  /:/~/:/    /  /:/ /:/_   _\_ \:\ \:\   /  /:/_/::\   /  /:/ /:/_    /  /:/   
 *  /__/:/ /:/\:| /__/:/ /:/___ /__/:/ /:/ /\ /__/\ \:\ \:\ /__/:/__\/\:\ /__/:/ /:/ /\  /  /::\   
 *  \  \:\/:/~/:/ \  \:\/:::::/ \  \:\/:/ /:/ \  \:\ \:\/:/ \  \:\ /~~/:/ \  \:\/:/ /:/ /__/:/\:\  
 *   \  \::/ /:/   \  \::/~~~~   \  \::/ /:/   \  \:\ \::/   \  \:\  /:/   \  \::/ /:/  \__\/  \:\ 
 *    \  \:\/:/     \  \:\        \  \:\/:/     \  \:\/:/     \  \:\/:/     \  \:\/:/        \  \:\
 *     \  \::/       \  \:\        \  \::/       \  \::/       \  \::/       \  \::/          \__\/
 *      \__\/         \__\/         \__\/         \__\/         \__\/         \__\/                
 *
 */

/** 
 * App Module
 */
var brewGet = angular.module('brewGet', [
  'ngAnimate',
  'ngCookies',
  'ngRoute',
  'ngTouch',
  'brewGetControllers',
  'brewGetServices',
  'brewGetDirectives'
]);

/** 
 * Routes 
 */
brewGet.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('!');

  $routeProvider.when('/', {
    templateUrl: '/partials/home.html',
    controller: 'HomeCtrl'
  });

  /** user & account routes */
  $routeProvider.when('/users', {
    templateUrl: '/partials/users/index.html',
    controller: 'UserIndex'
  });
  $routeProvider.when('/account/sign-up', {
    templateUrl: '/partials/account/sign-up.html',
    controller: 'AccountSignUp'
  });
  $routeProvider.when('/account/settings', {
    templateUrl: '/partials/account/settings.html',
    controller: 'AccountSettings'
  });
  $routeProvider.when('/account/sign-in', {
    templateUrl: '/partials/account/sign-in.html',
    controller: 'AccountSignIn'
  });
  $routeProvider.when('/account/sign-out', {
    resolve: {
      response: ['User', function (User) {
        User.signOut();
      }]
    }
  });

  /* default route */
  $routeProvider.otherwise({ 
    redirectTo: '/'
  });
}]);
