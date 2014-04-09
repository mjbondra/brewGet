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
  };
});

/**
 * Location parsing service
 */
app.factory('LocationParse', function () {
  return function (resource, opts) {
    var location = '';
    if (resource.location && resource.location.country && resource.location.country.name === 'United States') {
      if (resource.location.state && resource.location.state.abbreviation) {
        if (resource.location.city && resource.location.city.name) location = resource.location.city.name + ', ' + resource.location.state.abbreviation;
        else if (resource.location.state.name) location = resource.location.state.name;
        else location = resource.location.state.abbreviation;
      } else if (resource.location.city && resource.location.city.name) location = resource.location.city.name;
      else if (resource.location.name) location = resource.location.name;
    }
    else if (resource.location && resource.location.name) location = resource.location.name;
    return location;
  };
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
    IMAGE UTILITIES
\*------------------------------------*/

/**
 * Cover image selector
 */
app.factory('CoverImageSelect', ['ImageSelect', function (ImageSelect) {
  return {
    src: function (images, opts) {
      opts = opts || {};
      opts.geometry = opts.geometry || { width: 50 }; // default dimension
      return '/assets/img/bottle-' + ( opts.geometry.width || opts.geometry.height || 50 ) + '.png';
    }
  };
}]);

/**
 * Image selection service that will return an array of images that conform to a particular geometry
 *
 * @param {array} images - an array of images
 * @param {object} opts
 * @returns {array} - an array of images that conform to a particular geometry
 */
app.factory('ImageSelect', ['HighDPI', function (HighDPI) {
  return function (images, opts) {
    if (!images) return [];
    var i = images.length
      , _images = [];
    opts = opts || {};
    opts.geometry = opts.geometry || { width: 50 }; // default dimension
    if (opts.geometry.width) opts.geometry.width = HighDPI() ? opts.geometry.width * 2 : opts.geometry.width;
    if (opts.geometry.height) opts.geometry.height = HighDPI() ? opts.geometry.height * 2 : opts.geometry.height;
    while (i--) if ((opts.geometry.width && !opts.geometry.height && images[i].geometry.width === opts.geometry.width) ||
      (opts.geometry.width && opts.geometry.height && images[i].geometry.width === opts.geometry.width && images[i].geometry.height === opts.geometry.height) ||
      (opts.geometry.height && !opts.geometry.width && images[i].geometry.height === opts.geometry.height)) _images.push(images[i]);
    return _images;
  };
}]);

/**
 * User image selection utility
 *
 * @param {object} user - complete user object
 * @param {object} opts
 * @return {string} - image src
 */
app.factory('UserImageSelect', ['ImageSelect', 'Gravatar', function (ImageSelect, Gravatar) {
  return {
    src: function (user, opts) {
      opts = opts || {};
      opts.geometry = opts.geometry || { width: 50 }; // default dimension
      if (!user) return '/assets/img/bottle-' + ( opts.geometry.width || opts.geometry.height || 50 ) + '.png';
      if (opts.liveUpdate === true && user.gravatar) delete user.gravatar;
      var images = ImageSelect(user.images, opts);
      if (images && images[0] && images[0].src) return images[0].src;
      else return Gravatar.src(user, { s: opts.geometry.width || opts.geometry.height || 50 }) || '/assets/img/bottle-' + ( opts.geometry.width || opts.geometry.height || 50 ) + '.png';
    }
  };
}]);

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

/**
 * <nav> Service
 */
app.factory('Nav', function () {
  return {
    actions: [
      { title: 'Sign up', href: '/account/sign-up' },
      { title: 'Sign in', href: '/account/sign-in' }
    ],
    content: [
      { title: 'Posts', href: '/' },
      { title: 'Users', href: '/users'},
      { title: 'Beers', href: '/beers' },
      { title: 'Breweries', href: '/breweries' },
      { title: 'Locations', href: '/locations' },
      { title: 'Styles', href: '/styles' }
    ]
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
app.factory('Session', ['$cookies', '$q', function ($cookies, $q) {

  // this function is allowed to return a promise that accounts for cookie-setting delays
  // TODO: revisit this to see if this delay is removed or otherwise accounted for by Angular
  return function (opts) {
    opts = opts || {};
    opts.delay = opts.delay || false;
    opts.time = opts.time || 300; // 300ms
    if (opts.delay === false) return $cookies.username;
    var deferred = $q.defer();
    window.setTimeout(function () {
      deferred.resolve($cookies.username);
    }, opts.time);
    return deferred.promise;
  };
}]);
