'use strict';

/**
 *                     ___           ___           ___           ___           ___                 
 *      _____         /  /\         /  /\         /__/\         /  /\         /  /\          ___   
 *     /  /::\       /  /::\       /  /:/_       _\_ \:\       /  /:/_       /  /:/_        /  /\  
 *    /  /:/\:\     /  /:/\:\     /  /:/ /\     /__/\ \:\     /  /:/ /\     /  /:/ /\      /  /:/  
 *   /  /:/~/::\   /  /:/~/:/    /  /:/ /:/_   _\_ \:\ \:\   /  /:/_/::\   /  /:/ /:/_    /  /:/   
 *  /__/:/ /:/\:| /__/:/ /:/___ /__/:/ /:/ /\ /__/\ \:\ \:\ /__/:/__\/\:\ /__/:/ /:/ /\  /  /::\   
 *  \  \:\/:/~/:/ \  \:\/:::::/ \  \:\/:/ /:/ \  \:\ \:\/:/ \  \:\ /~~/:/ \  \:\/:/ /:/ /__/:/\:\  
 *   \  \::/ /:/   \  \::/~~~~   \  \::/ /:/   \  \:\ \::/   \  \:\  /:/   \  \::/ /:/  \__\/  \:\ 
 *    \  \:\/:/     \  \:\        \  \:\/:/     \  \:\/:/     \  \:\/:/     \  \:\/:/        \  \:\
 *     \  \::/       \  \:\        \  \::/       \  \::/       \  \::/       \  \::/          \__\/
 *      \__\/         \__\/         \__\/         \__\/         \__\/         \__\/                
 *
 */

// File upload shim for old browsers
window.FileAPI = {
  jsPath: '/assets/lib/ng-file-upload/',
  staticPath: '/assets/lib/ng-file-upload/'
};
require('../assets/lib/ng-file-upload/angular-file-upload-shim');

// Core Angular modules 
require('../assets/lib/angular/angular');
require('../assets/lib/angular-animate/angular-animate');
require('../assets/lib/angular-cookies/angular-cookies');
require('../assets/lib/angular-resource/angular-resource');
require('../assets/lib/angular-route/angular-route');
require('../assets/lib/angular-touch/angular-touch');

// 3rd-party Angular modules
require('../assets/lib/ng-file-upload/angular-file-upload');

// App Dependencies
require('../app/controllers/beers');
require('../app/controllers/breweries');
require('../app/controllers/home');
require('../app/controllers/html');
require('../app/controllers/messages');
require('../app/controllers/posts');
require('../app/controllers/users');
require('../app/directives');
require('../app/filters');
require('../app/services/libraries');
require('../app/services/resources');
require('../app/services/responses');
require('../app/services/utilities');

// Router
require('./routes');

// AngularJS/App modules
var app = angular.module('brewGet', [
  'ngAnimate',
  'ngCookies',
  'ngRoute',
  'ngTouch',
  'brewGet.controllers.beers',
  'brewGet.controllers.breweries',
  'brewGet.controllers.home',
  'brewGet.controllers.html',
  'brewGet.controllers.messages',
  'brewGet.controllers.posts',
  'brewGet.controllers.users',
  'brewGet.services.libraries',
  'brewGet.services.resources',
  'brewGet.services.responses',
  'brewGet.services.utilities',
  'brewGet.directives',
  'brewGet.filters',
  'brewGet.routes'
]);
