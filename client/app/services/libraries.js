'use strict';

var app = angular.module('brewGet.services.libraries', []);

/**
 * Module dependencies
 */
var _ = require('underscore')
  , gravatar = require('gravatar');

/**
 * Underscore Service
 */
app.factory('_', function () {
  return _;
});

/**
 * Gravatar URL Generating Service
 */
app.factory('Gravatar', ['HighDPI', function (HighDPI) {
  return {
    url: function (email, options, https) {
      options = options || {};
      options.s = options.s || 100;
      if (email) return gravatar.url(email, options, https);
    }
  };
}]);

/**
 * Google Places API Service
 */
app.factory('PlacesAPI', ['$rootScope', function ($rootScope) {
  var maps = window.google.maps
    , places = maps.places
    , element;
  return {
    setElementByID: function (elementID, types) {
      element = document.getElementById(elementID);
      if (element !== null) {
        var autocomplete = new places.Autocomplete(element, { types: [ types ] });
        maps.event.addListener(autocomplete, 'place_changed', function () {
          var place = autocomplete.getPlace();
          if (!place.geometry) return;
          $rootScope.$broadcast(elementID, place);
        });
      } else {
        setTimeout(function () {
          this.setElementByID(elementID, types);
        }.bind(this), 300); // try again
      }
    }
  };
}]);
