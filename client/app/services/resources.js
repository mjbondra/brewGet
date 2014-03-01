'use strict';

var app = angular.module('brewGet.services.resources', ['ngResource']);

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
