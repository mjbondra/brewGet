'use strict';

  //////////////
 // SERVICES //
//////////////

var app = angular.module('brewGet.services', ['ngResource']);

/**
 * Module dependencies
 */
var _ = require('underscore');

/*------------------------------------*\
    EXTERNAL LIBRARY SERVICES
\*------------------------------------*/

/**
 * Underscore Service
 */
app.factory('_', function () {
  return _;
});

/**
 * Google Places API Service
 */
app.factory('PlacesAPI', ['$rootScope', function ($rootScope) {
  var maps = window.google.maps
    , places = maps.places
    , autocomplete
    , element;
  return {
    setElementByID: function (elementID, types) {
      element = document.getElementById(elementID);
      autocomplete = new places.Autocomplete(element, { types: [ types ] });
      maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();
        if (!place.geometry) return;
        $rootScope.$broadcast('place', place);
      });
    }
  };
}]);

/*------------------------------------*\
    REQUEST/RESPONSE SERVICES
\*------------------------------------*/

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
        if ((res.status === 401 || res.status === 409 || res.status === 422) && res.data && res.data.messages) {
          $rootScope.$broadcast('validationErrors', res.data.messages);
        }
        return $q.reject(res);
      }
    };
  }]);
  $httpProvider.interceptors.push('brewGetInterceptor');
}]);

/*------------------------------------*\
    ELEMENTAL SERVICES
\*------------------------------------*/

/**
 * <head> Service
 */
app.factory('Head', function () {
  var defaultTitle = 'brewGet';
  var title = defaultTitle;
  var description = 'brewGet is a web application designed to support the beer trading community';
  return {
    description: function (newDescription) {
      if (typeof newDescription !== 'undefined') description = newDescription;
      else return description;
    },
    title: function (newTitle) {
      if (typeof newTitle !== 'undefined') title = ( newTitle === defaultTitle ? defaultTitle : newTitle + ' || brewGet' );
      else return title;
    }
  };
});

/**
 * <nav> Service
 */
app.factory('Nav', ['$http', function ($http) {
  return function () {
    return $http.get('api/nav', { params: { t: new Date().getTime() }});
  };
}]);

/*------------------------------------*\
    DIRECTIVE SERVICES
\*------------------------------------*/

/**
 * Message Service
 */
app.factory('MessageHandler', function () {
  return {
    process: function (alerts) {
      var cssClasses = [];
      if (alerts.length > 0) {
        cssClasses.push('active-messages');
      }
      return { 
        alerts: alerts, 
        cssClasses: cssClasses 
      };
    }
  };
});

/**
 * Date Service
 */
app.factory('DateHandler', ['_', function (_) {
  return {
    months: [
      { name: 'January', value: 1, dayCount: 31 },
      { name: 'February', value: 2, dayCount: 28 },
      { name: 'March', value: 3, dayCount: 31 },
      { name: 'April', value: 4, dayCount: 30 },
      { name: 'May', value: 5, dayCount: 31 },
      { name: 'June', value: 6, dayCount: 30 },
      { name: 'July', value: 7, dayCount: 31 },
      { name: 'August', value: 8, dayCount: 31 },
      { name: 'September', value: 9, dayCount: 30 },
      { name: 'October', value: 10, dayCount: 31 },
      { name: 'November', value: 11, dayCount: 30 },
      { name: 'December', value: 12, dayCount: 31 }
    ],
    years: _.range(1900, new Date().getFullYear() + 1).reverse()
  };
}]);

/*------------------------------------*\
    RESOURCE SERVICES
\*------------------------------------*/

/**
 * User Service
 */
app.factory('User', ['$rootScope', '$resource', '$location', function ($rootScope, $resource, $location) {
  return $resource('api/users/:userId', {}, {
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
      params: { userId: 'sign-in' },
      interceptor: {
        response: function (res) {
          $rootScope.$broadcast('reloadNav');
          $location.path('/');
        }
      }
    },
    signOut: {
      method: 'DELETE',
      params: { userId: 'sign-out' },
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
    AUTHENTICATION SERVICES
\*------------------------------------*/

/**
 * Auth-checking Service
 * 
 * @param   {object}  [opts]
 * @param   {boolean} [opts.delay=false]
 * @param   {number}  [opts.time=300]
 *
 * @returns {object|promise}
 */
app.factory('Auth', ['$cookies', '$q', function ($cookies, $q) {

  // this function is allowed to return a promise that accounts for cookie-setting delays
  // TODO: revisit this to see if this delay is removed or otherwise accounted for by Angular
  return function (opts) {
    opts = opts || {};
    opts.delay = opts.delay || false;
    opts.time = opts.time || 300; // 300ms
    if (opts.delay === false) return angular.fromJson($cookies.auth);
    var deferred = $q.defer();
    setTimeout(function () {
      deferred.resolve(angular.fromJson($cookies.auth));
    }, opts.time);
    return deferred.promise;
  }
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
