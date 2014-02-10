'use strict';

var app = angular.module('brewGet.controllers.beers', []);

/**
 * Beer index
 * ROUTE /#!/
 * TEMPLATE /partials/beers/index.html
 */
app.controller('beers.index', ['$scope', 'Head', function ($scope, Head) {
  Head.title('Beers');
  Head.description('Beers');
}]);

/**
 * Beer show
 * ROUTE /#!/
 * TEMPLATE /partials/beers/show.html
 */
app.controller('beers.show', ['$scope', 'Head', function ($scope, Head) {
  Head.title('Beer');
  Head.description('Beer');
}]);

/**
 * Beer new
 * ROUTE /#!/
 * TEMPLATE /partials/beers/new.html
 */
app.controller('beers.new', ['$scope', 'Head', function ($scope, Head) {
  Head.title('Add Beer');
  Head.description('Add Beer');
}]);

/**
 * Beer edit
 * ROUTE /#!/
 * TEMPLATE /partials/beers/edit.html
 */
app.controller('beers.edit', ['$scope', 'Head', function ($scope, Head) {
  Head.title('Edit Beer');
  Head.description('Edit Beer');
}]);
