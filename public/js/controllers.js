'use strict';

  /////////////////
 // CONTROLLERS //
/////////////////

var brewGetControllers = angular.module('brewGetControllers', ['ngTouch']);

/*------------------------------------*\
    GLOBAL CONTROLLERS
\*------------------------------------*/

/** 
 * Head Controller
 */
brewGetControllers.controller('HeadCtrl', ['$scope', 'Head', function ($scope, Head) {
  $scope.Head = Head;
}]);

/** 
 * Navigation Controller
 * TEMPLATE /partials/nav/index.html
 */
brewGetControllers.controller('NavCtrl', ['$scope', 'Nav', function ($scope, Nav) {

  /** load nav */
  Nav.success(function (nav) {
    $scope.Nav = nav;
  });

  /** active tree functionality */
  $scope.activeTree = false;
  $scope.$on('$routeChangeSuccess', function () {
    $scope.activeTree = false;
  });
  $scope.showNavTree = function (context) {
    if ($scope.activeTree === context || typeof context === 'undefined') $scope.activeTree = false;
    else {
      $scope.activeTree = context;
    }
  }
}]);

/** 
 * Homepage Controller !!! This is temporary and will be removed !!!
 * GET /
 * TEMPLATE /partials/home.html
 */
brewGetControllers.controller('HomeCtrl', ['$scope', 'Head', 'MikeData', function ($scope, Head, MikeData) {
  Head.setTitle('brewGet');
  Head.setDescription('brewGet is a web application designed to support the beer trading community');
  $scope.mikedata = MikeData.get({ resourceId: 'test' });
}]);

/*------------------------------------*\
    USER CONTROLLERS
\*------------------------------------*/

/**
 * Index
 * GET /#/users
 * TEMPLATE /partials/users/index.html
 */
brewGetControllers.controller('UserIndexCtrl', ['$scope', 'Head', 'User', function ($scope, Head, User) {
  Head.setTitle('Users');
  Head.setDescription('An index of users on brewGet.');
  $scope.users = User.query();
}]);

/**
 * New
 * GET /#/users/new
 * TEMPLATE /partials/users/new.html
 */
brewGetControllers.controller('UserNewCtrl', ['$scope', 'Head', 'User', function ($scope, Head, User) {
  Head.setTitle('Sign up');
  Head.setDescription('Sign up for an account on brewGet.');
  $scope.user = new User();
  // $scope.validationErrors = [{ field: 'test', message: 'test '}];
}]);

/**
 * Authentication
 * GET /#/users/auth
 * TEMPLATE /partials/users/auth.html
 */
brewGetControllers.controller('UserAuthCtrl', ['$scope', 'Head', function ($scope, Head) {
  Head.setTitle('Sign in');
  Head.setDescription('Sign in to your brewGet account.');
}]);
