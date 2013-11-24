'use strict';

/** 
 * Services
 */
var brewGetServices = angular.module('brewGetServices', []);

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
