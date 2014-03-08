'use strict';

var app = angular.module('brewGet.controllers.html', []);

/**
 * Head Controller
 */
app.controller('html.head', ['$scope', 'Head', function ($scope, Head) {
  $scope.Head = Head;
}]);

/**
 * Navigation Controller
 * TEMPLATE /partials/nav/index.html
 */
app.controller('html.nav', ['$scope', '$location', 'API', 'Nav', function ($scope, $location, API, Nav) {
  $scope.content = Nav.content;

  /**
   * Navigation functions
   */

  /*-- controller functions --*/

  // load nav
  var loadNav = function () {
    API('nav').success(function (nav) {
      $scope.actions = nav.actions;
      $scope.account = nav.account;
    }).error(function () {
      $scope.actions = Nav.actions;
      if ($scope.account) delete $scope.account;
    });
  };
  // collapse expanded trees
  var collapseTrees = function () {
    $scope.expandedTree = false;
  };

  /*-- $scope functions --*/

  // set tree to expand based on passed context
  $scope.expandTree = function (context) {
    if (context === $scope.expandedTree || typeof context === 'undefined') $scope.expandedTree = false;
    else $scope.expandedTree = context;
  };
  // function used to determine expanded tree
  $scope.isExpanded = function (context) {
    if (context === $scope.expandedTree) return true;
    else return false;
  };
  // function used to determine active path
  $scope.isActive = function (href) {
    if (href === $location.path()) return true;
    else return false;
  };

  /**
   * Navigation events
   */

  /*-- broadcast events --*/

  // reload nav on 'reloadNav' event
  $scope.$on('reloadNav', function () {
    loadNav();
  });
  // collapse trees on route change success
  $scope.$on('$routeChangeSuccess', function () {
    collapseTrees();
  });

  /*-- onload events --*/

  loadNav();
  collapseTrees();
}]);
