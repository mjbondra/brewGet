'use strict';

var app = angular.module('brewGet.services.responses', []);

/** 
 * Response Service
 */
app.config(['$provide', '$httpProvider', function ($provide, $httpProvider) { 
  $provide.factory('brewGetInterceptor', ['$rootScope', '$q', function ($rootScope, $q) {
    return {
      response: function (res) {
        /** response for content added */
        if (res.status === 201 && res.data && res.data.messages) {
          $rootScope.$broadcast('globalMessages', res.data.messages);
        }
        return res || $q.when(res);
      },
      responseError: function (res) {
        /** response for authentication (401), validation (422), and uniqueness (409) errors */
        if ((res.status === 400 || res.status === 401 || res.status === 409 || res.status === 422) && res.data && res.data.messages) {
          $rootScope.$broadcast('validationErrors', res.data.messages);
        }
        return $q.reject(res);
      }
    };
  }]);
  $httpProvider.interceptors.push('brewGetInterceptor');
}]);
