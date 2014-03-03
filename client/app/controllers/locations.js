'use strict';

var app = angular.module('brewGet.controllers.locations', []);

/**
 * Location index
 * ROUTE /#!/
 * TEMPLATE /partials/locations/index.html
 */
app.controller('locations.index', ['$scope', 'Head', 'Location', function ($scope, Head, Location) {
  Head.title('Locations');
  Head.description('Locations');
  $scope.locations = Location.query();
}]);

/**
 * Location show
 * ROUTE /#!/
 * TEMPLATE /partials/locations/show.html
 */
app.controller('locations.show', ['$scope', 'Head', 'Location', function ($scope, Head, Location) {
  Head.title('Location');
  Head.description('Location');
}]);

/**
 * Location new
 * ROUTE /#!/
 * TEMPLATE /partials/locations/new.html
 */
app.controller('locations.new', ['$scope', 'Head', 'Location', function ($scope, Head, Location) {
  Head.title('Add Location');
  Head.description('Add Location');
}]);

/**
 * Location edit
 * ROUTE /#!/
 * TEMPLATE /partials/locations/edit.html
 */
app.controller('locations.edit', ['$scope', 'Head', 'Location', function ($scope, Head, Location) {
  Head.title('Edit Location');
  Head.description('Edit Location');
}]);
