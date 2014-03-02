'use strict';

var app = angular.module('brewGet.controllers.styles', []);

/**
 * Style index
 * ROUTE /#!/
 * TEMPLATE /partials/styles/index.html
 */
app.controller('styles.index', ['$scope', 'Head', 'Style', function ($scope, Head, Style) {
  Head.title('Styles');
  Head.description('Styles');
  $scope.styles = Style.query();
}]);

/**
 * Style show
 * ROUTE /#!/
 * TEMPLATE /partials/styles/show.html
 */
app.controller('styles.show', ['$scope', 'Head', 'Style', function ($scope, Head, Style) {
  Head.title('Style');
  Head.description('Style');
}]);

/**
 * Style new
 * ROUTE /#!/
 * TEMPLATE /partials/styles/new.html
 */
app.controller('styles.new', ['$scope', 'Head', 'Style', function ($scope, Head, Style) {
  Head.title('Add Style');
  Head.description('Add Style');
}]);

/**
 * Style edit
 * ROUTE /#!/
 * TEMPLATE /partials/styles/edit.html
 */
app.controller('styles.edit', ['$scope', 'Head', 'Style', function ($scope, Head, Style) {
  Head.title('Edit Style');
  Head.description('Edit Style');
}]);
