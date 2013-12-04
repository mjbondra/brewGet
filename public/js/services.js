'use strict';

  //////////////
 // SERVICES //
//////////////

var brewGetServices = angular.module('brewGetServices', ['ngResource']);

/** global service for handling backend responses */
brewGetServices.config(function ($provide, $httpProvider) { 
  $provide.factory('brewGetInterceptor', function ($rootScope, $q) {
    return {
      // response: function (res) {
      //   return res || $q.when(res);
      // },
      responseError: function (res) {
        /** response for validation and uniqueness errors */
        if ((res.status === 409 || res.status === 422) && res.data && res.data.fieldValidationErrors) {
          $rootScope.$broadcast('validationErrors', res.data.fieldValidationErrors);
        }
        return $q.reject(res);
      }
    };
  });
  $httpProvider.interceptors.push('brewGetInterceptor');
});

/** service for getting and setting values within the html head element */
brewGetServices.factory('Head', function() {
  var defaultTitle = 'brewGet';
  var title = defaultTitle;
  var description = 'brewGet is a web application designed to support the beer trading community';
  return {
    getDescription: function () {
      return description;
    },
    getTitle: function () { 
      return title; 
    },
    setDescription: function (newDescription) {
      description = newDescription;
    },
    setTitle: function (newTitle) { 
      title = ( newTitle == defaultTitle ? defaultTitle : newTitle + ' || brewGet' );
    }
  };
});

/** service for getting and setting values within the primary html nav element */
brewGetServices.factory('Nav', ['$http', function ($http) {
  return $http.get('nav');
}]);

/** test service for bringing in JSON */
brewGetServices.factory('MikeData', ['$resource', function ($resource) {
  return $resource('test-api/:resourceId.json');
}]);

/** user service for JSON API */
brewGetServices.factory('User', ['$rootScope', '$resource', function ($rootScope, $resource) {
  return $resource('users/:userId', {}, {
    save: { 
      method:'POST', 
      params: { userId: 'new' }, 
      interceptor: {
        response: function (res) {
          console.log('added', res);
        }
      }
    }
  });
}]);
