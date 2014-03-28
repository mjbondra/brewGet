'use strict';

var app = angular.module('brewGet.services.libraries', []);

/**
 * Module dependencies
 */
var _ = require('underscore')
  , gravatar = require('gravatar')
  , sockjs_url = window.location.protocol + '//' + window.location.hostname + ":4000/ws"
  , sockjs = new SockJS(sockjs_url);

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
        window.setTimeout(function () {
          this.setElementByID(elementID, types);
        }.bind(this), 300); // try again
      }
    }
  };
}]);

/**
 * SockJS Service
 */
app.factory('SockJS', ['$rootScope', '$cookies', function ($rootScope, $cookies) {
  return {
    context: function (context, opts) {
      sockjs.send(angular.toJson({
        action: 'open',
        context: context,
        session: $cookies['koa.sid']
      }));
      return {
        close: function () {},
        send: function (message) {
          sockjs.send(angular.toJson({
            action: 'post',
            context: context,
            message: message,
            session: $cookies['koa.sid']
          }));
        }
      };
    },
    init: function () {
      sockjs.onmessage = function (e) {
        var data;
        try {
          data = angular.fromJson(e.data);
        } catch (err) {
          return;
        }
        $rootScope.$broadcast('socket:' + data.context, data.message);
      };
    }
  };
}]);
