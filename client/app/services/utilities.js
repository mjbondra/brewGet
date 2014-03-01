'use strict';

var app = angular.module('brewGet.services.utilities', []);

/**
 * Module dependencies
 */
var slug = require('../../../server/assets/lib/slug-utilities').slug;

/*------------------------------------*\
    GENERAL UTILITIES
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
    url = 'autocomplete/' + url + '/' + input;
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
    ELEMENTAL UTILITIES
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
    DIRECTIVE UTILITIES
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
    AUTHENTICATION UTILITIES
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
