'use strict';

var app = angular.module('brewGet.services.libraries', []);

/**
 * Module dependencies
 */
var _ = require('underscore')
  , gravatar = require('gravatar')
  , sockjs_url = window.location.protocol + '//' + window.location.hostname + ":4000/ws"
  , sockjs;

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
    src: function (user, opts) {
      if (!user) return;
      opts = opts || {};
      if (user.gravatar) {
        var qs = '';
        if (opts.s) qs = 's=' + opts.s;
        if (opts.d) qs = ( qs === '' ? qs : qs + '&' ) + 'd=' + opts.d;
        return user.gravatar + '?' + qs;
      } else if (user.email) return gravatar.url(user.email, opts).replace('http:', '');
      else return;
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
        context: context,
        event: 'context.open'
      }));
      return {
        close: function () {
          sockjs.send(angular.toJson({
            context: context,
            event: 'context.close'
          }));
        },
        send: function (message) {
          sockjs.send(angular.toJson({
            context: context,
            event: 'message',
            message: message
          }));
        }
      };
    },
    init: function () {
      sockjs = new SockJS(sockjs_url);
      sockjs.onopen = function () {
        sockjs.send(angular.toJson({
          event: 'session.connection.add',
          sid: $cookies['koa.sid']
        }));
      };
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
