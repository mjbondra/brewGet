
/**
 * AngularJS and Supplemental Modules
 */

// File upload shim for old browsers
FileAPI = {
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
