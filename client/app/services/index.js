'use strict';

  //////////////
 // SERVICES //
//////////////

var app = angular.module('brewGet.services', ['ngResource']);

/**
 * Module dependencies
 */
var _ = require('underscore')
  , gravatar = require('gravatar')
  , slug = require('../../../server/assets/lib/slug-utilities').slug;

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

/*------------------------------------*\
    UTILITY SERVICES
\*------------------------------------*/

/**
 * API Service
 */
app.factory('API', ['$http', function ($http) {
  return function (url, method) {
    url = 'api/' + url;
    method = method || 'GET';
    return $http({ method: method, url: url, params: { t: new Date().getTime() }});
  };
}]);

/**
 * Autocomplete Service
 */
app.factory('Autocomplete', ['API', 'Slug', function (API, Slug) {
  return function (url, input, strip) {
    input = Slug(input, strip);
    url = url + input;
    return API(url, 'GET');
  };
}]);

/** 
 * HighDPI Service - inspired by RetinaJS (http://retinajs.com/)
 *
 * @return {boolean} - whether or not a screen is high density
 */
app.factory('HighDPI', function () {
  var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.3),\
    (min--moz-device-pixel-ratio: 1.3),\
    (-o-min-device-pixel-ratio: 13/10),\
    (min-resolution: 1.3dppx)";
  return function () {
    if (window.devicePixelRatio > 1) return true;
    if (window.matchMedia && window.matchMedia(mediaQuery).matches) return true;
    return false;
  }
});

/** 
 * Image selection service that will pull an appropriately sized image an array of images
 *
 * @param {array} - an array of images
 */
app.factory('ImageSelect', ['Gravatar', 'HighDPI', function (Gravatar, HighDPI) {
  return function (images, size, opts) {
    if (!images) return 'assets/img/bottle.png';
    var i = images.length
      , image = {}
      , opts = opts || {}
      , size = size || { height: 200, width: 200 };
    opts.https = ( opts.https === true ? true : false );
    size.height = ( HighDPI() ? size.height * 2 : size.height );
    size.width = ( HighDPI() ? size.width * 2 : size.width );
    while (i--) {
      if (images[i].geometry.width === size.width && images[i].geometry.height === size.height) image = images[i];
    }
    if (image.src) return image.src;
    else if (opts.email) return Gravatar.url(opts.email, { s: size.width }, opts.https);
    else return 'assets/img/bottle.png';
  }
}]);

/** 
 * Location parsing service
 */
app.factory('LocationParse', function () {
  return function (resource, opts) {
    if (resource._location && resource._location.country === 'United States') {
      return (resource._location.city ? resource._location.city + ', ' : '') + ( resource._location.state ? resource._location.state : '' );
    } else {
      return resource.location;
    }
  }
});

/**
 * Convert string to slug
 *
 * @param {string} str - string to convert
 * @param {boolean} strip - removes non-word characters; do not replace with '-'
 * @returns {string} - slug
 */
app.factory('Slug', function () {
  return slug;
});

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
        if ((res.status === 400 || res.status === 401 || res.status === 409 || res.status === 422) && res.data && res.data.messages) {
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
      { name: 'January', value: 0, dayCount: 31 },
      { name: 'February', value: 1, dayCount: 28 },
      { name: 'March', value: 2, dayCount: 31 },
      { name: 'April', value: 3, dayCount: 30 },
      { name: 'May', value: 4, dayCount: 31 },
      { name: 'June', value: 5, dayCount: 30 },
      { name: 'July', value: 6, dayCount: 31 },
      { name: 'August', value: 7, dayCount: 31 },
      { name: 'September', value: 8, dayCount: 30 },
      { name: 'October', value: 9, dayCount: 31 },
      { name: 'November', value: 10, dayCount: 30 },
      { name: 'December', value: 11, dayCount: 31 }
    ],
    years: _.range(1900, new Date().getFullYear() + 1).reverse()
  };
}]);

/*------------------------------------*\
    RESOURCE SERVICES
\*------------------------------------*/

/**
 * Post Service
 */
app.factory('Post', ['$resource', '$location', function ($resource, $location) {
  return $resource('api/posts/:slug', {}, {
    save: {
      method:'POST',
      interceptor: {
        response: function (res) {
          console.log(res);
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
    AUTHENTICATION SERVICES
\*------------------------------------*/

/**
 * Auth-checking Service
 * 
 * @param   {object}  [opts]
 * @param   {boolean} [opts.delay=false]
 * @param   {number}  [opts.time=300]
 *
 * @returns {string|promise} - logged-in username
 */
app.factory('Username', ['$cookies', '$q', function ($cookies, $q) {

  // this function is allowed to return a promise that accounts for cookie-setting delays
  // TODO: revisit this to see if this delay is removed or otherwise accounted for by Angular
  return function (opts) {
    opts = opts || {};
    opts.delay = opts.delay || false;
    opts.time = opts.time || 300; // 300ms
    if (opts.delay === false) return $cookies.username;
    var deferred = $q.defer();
    setTimeout(function () {
      deferred.resolve($cookies.username);
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
