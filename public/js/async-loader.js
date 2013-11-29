require([
  '../lib/angular/angular.min', 
  '../lib/angular-route/angular-route.min', 
  '../lib/angular-resource/angular-resource.min',
  'app',
  'controllers',
  'services',
  '//use.typekit.net/uby8kic.js'
], function () {
  try{Typekit.load();}catch(e){}
});
