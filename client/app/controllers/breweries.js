'use strict';

var app = angular.module('brewGet.controllers.breweries', []);

/**
 * Brewery index
 * ROUTE /#!/
 * TEMPLATE /partials/breweries/index.html
 */
app.controller('breweries.index', ['$scope', 'Head', function ($scope, Head) {
  Head.title('Breweries');
  Head.description('Breweries');
}]);

/**
 * Brewery show
 * ROUTE /#!/
 * TEMPLATE /partials/breweries/show.html
 */
app.controller('breweries.show', ['$scope', 'Head', function ($scope, Head) {
  Head.title('Brewery');
  Head.description('Brewery');
}]);

/**
 * Brewery new
 * ROUTE /#!/
 * TEMPLATE /partials/breweries/new.html
 */
app.controller('breweries.new', ['$scope', 'Head', function ($scope, Head) {
  Head.title('Add Brewery');
  Head.description('Add Brewery');
}]);

/**
 * Brewery edit
 * ROUTE /#!/
 * TEMPLATE /partials/breweries/edit.html
 */
app.controller('breweries.edit', ['$scope', 'Head', function ($scope, Head) {
  Head.title('Edit Brewery');
  Head.description('Edit Brewery');
}]);
