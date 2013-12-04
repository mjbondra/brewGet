require.config({
  paths: {
    angular: '../lib/angular/angular.min',
    angularRoute: '../lib/angular-route/angular-route.min',
    angularResource: '../lib/angular-resource/angular-resource.min',
    angularTouch: '../lib/angular-touch/angular-touch.min',
    typeKit: '//use.typekit.net/uby8kic'
  },
  shim: {
    angular: {
      exports: 'angular' 
    },
    angularRoute: ['angular'],
    angularResource: ['angular'],
    angularTouch: ['angular'],
    app: ['angular'],
    controllers: ['angular'],
    services: ['angular'],
    directives: ['angular']
  }
});

/** do not bootstrap with AngularJS until we have asynchronously loaded all of the AngularJS-related scripts */
window.name = 'NG_DEFER_BOOTSTRAP!';

require([  
  'angular',
  'angularRoute',
  'angularResource',
  'angularTouch',
  'app',
  'controllers',
  'services',
  'directives'
], function (angular, angularRoute, angularResource, app, controllers, services, directives) {
  'use strict';
  angular.resumeBootstrap();
});

require(['typeKit'], function (typeKit) {
  Typekit.load();
});
