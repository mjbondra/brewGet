'use strict';

var app = angular.module('brewGet.services.resources', ['ngResource']);

/**
 * Beer Service
 */
app.factory('Beer', ['$resource', function ($resource) {
  return $resource('api/beers/:beer');
}]);

/**
 * Brewery Service
 */
app.factory('Brewery', ['$resource', function ($resource) {
  return $resource('api/breweries/:brewery');
}]);

/**
 * Post Service
 */
app.factory('Post', ['$resource', '$location', function ($resource, $location) {
  return $resource('api/posts/:slug', {}, {
    save: {
      method:'POST',
      interceptor: {
        response: function (res) {
          $location.path('/');
        }
      }
    }
  });
}]);

/**
 * Style Service
 */
app.factory('Style', ['$resource', function ($resource) {
  return $resource('api/styles/:style');
}]);

/**
 * User Service
 */
app.factory('User', ['$rootScope', '$resource', '$location', function ($rootScope, $resource, $location) {
  return $resource('api/users/:slug', {}, {
    save: { 
      method:'POST', 
      interceptor: {
        response: function (res) {
          $rootScope.$broadcast('reloadNav');
          $location.path('/');
        }
      }
    },
    signIn: {
      method: 'POST',
      params: { slug: 'sign-in' },
      interceptor: {
        response: function (res) {
          $rootScope.$broadcast('reloadNav');
          $location.path('/');
        }
      }
    },
    signOut: {
      method: 'DELETE',
      params: { slug: 'sign-out' },
      interceptor: {
        response: function (res) {
          $rootScope.$broadcast('reloadNav');
          $location.path('/');
        }
      }
    },
    update: { 
      method:'PUT',
      interceptor: {
        response: function (res) {
          $rootScope.$broadcast('reloadNav');
          $location.path('/');
        }
      }
    }
  });
}]);

/*------------------------------------*\
    TEMP/PLACEHOLDER SERVICES
\*------------------------------------*/

/** 
 * Test Service for Bringing in JSON 
 */
app.factory('MikeData', ['$resource', function ($resource) {
  return $resource('test-api/:resourceId.json');
}]);
