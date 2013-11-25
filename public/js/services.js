'use strict';

/** 
 * Services
 */
var brewGetServices = angular.module('brewGetServices', ['ngResource']);

/** service for getting and setting values within the html head element */
brewGetServices.factory('Head', function() {
  var title = 'brewGet';
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
      title = newTitle;
    }
  };
});

/** service for getting and setting values within the primary html nav element */
brewGetServices.factory('Nav', ['$http', function ($http) {
  return $http.get('test-api/nav/index.json');
}]);

/** test service for bringing in JSON */
brewGetServices.factory('MikeData', ['$resource', function ($resource) {
  return $resource('test-api/:resourceId.json');
}]);
