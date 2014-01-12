require.config({
  paths: {
    async: '../assets/lib/requirejs-plugins/src/async',
    angular: '../assets/lib/angular/angular.min',
    angularAnimate: '../assets/lib/angular-animate/angular-animate.min',
    angularCookies: '../assets/lib/angular-cookies/angular-cookies.min',
    angularRoute: '../assets/lib/angular-route/angular-route.min',
    angularResource: '../assets/lib/angular-resource/angular-resource.min',
    angularTouch: '../assets/lib/angular-touch/angular-touch.min',
    controllers: '../app/controllers',
    directives: '../app/directives',
    filters: '../app/filters',
    services: '../app/services',
    typeKit: '//use.typekit.net/uby8kic',
    underscore: '../assets/lib/underscore/underscore-min'
  },
  shim: {
    angular: {
      exports: 'angular' 
    },
    angularAnimate: ['angular'],
    angularCookies: ['angular'],
    angularRoute: ['angular'],
    angularResource: ['angular'],
    angularTouch: ['angular'],
    controllers: ['angular'],
    directives: ['angular'],
    filters: ['angular'],
    routes: ['angular'],
    services: ['angular']
  }
});

/** do not bootstrap with AngularJS until we have asynchronously loaded all of the AngularJS-related scripts */
window.name = 'NG_DEFER_BOOTSTRAP!';

require([
  'async!https://maps.googleapis.com/maps/api/js?libraries=places&sensor=false',
  'underscore',
  'angular',
  'angularAnimate',
  'angularCookies',
  'angularRoute',
  'angularResource',
  'angularTouch',
  'controllers',
  'directives',
  'filters',
  'routes',
  'services'
], function (places, underscore, angular, angularAnimate, angularCookies, angularRoute, angularResource, angularTouch, controllers, directives, filters, routes, services) {
  'use strict';

  /** 
   * Angular modules
   */
  var app = angular.module('brewGet', [
    'ngAnimate',
    'ngCookies',
    'ngRoute',
    'ngTouch',
    'brewGet.controllers',
    'brewGet.services',
    'brewGet.directives',
    'brewGet.filters',
    'brewGet.routes'
  ]);

  /** resume bootstrap */
  angular.resumeBootstrap();

});

require(['typeKit'], function (typeKit) {
  Typekit.load();
});
