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
  'ngRoute',
  'brewGetControllers',
  'brewGetServices',
  'brewGetDirectives'
]);

/** 
 * Routes 
 */
brewGet.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: '/partials/home.html',
      controller: 'HomeCtrl'
    });

    /* user routes */
    $routeProvider.when('/users', {
      templateUrl: 'partials/users/index.html',
      controller: 'UserIndexCtrl'
    });
    $routeProvider.when('/users/new', {
      templateUrl: '/partials/users/new.html',
      controller: 'UserNewCtrl'
    });
    $routeProvider.when('/users/auth', {
      templateUrl: '/partials/users/auth.html',
      controller: 'UserAuthCtrl'
    });

    /* default route */
    $routeProvider.otherwise({ 
      redirectTo: '/' 
    });
}]);
