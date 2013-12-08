'use strict';

  /////////////////
 // CONTROLLERS //
/////////////////

var brewGetControllers = angular.module('brewGetControllers', []);

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
 * ROUTE /#!/
 * TEMPLATE /partials/home.html
 */
brewGetControllers.controller('HomeCtrl', ['$scope', 'Head', 'MikeData', function ($scope, Head, MikeData) {
  Head.title('brewGet');
  Head.description('brewGet is a web application that supports the non-monetary exchange of regionally-limited or otherwise difficult to acquire beer.');
  $scope.mikedata = MikeData.get({ resourceId: 'test' });
}]);

/*------------------------------------*\
    USER CONTROLLERS
\*------------------------------------*/

/**
 * Index
 * ROUTE /#!/users
 * TEMPLATE /partials/users/index.html
 */
brewGetControllers.controller('UserIndexCtrl', ['$scope', 'Head', 'User', function ($scope, Head, User) {
  Head.title('Users');
  Head.description('An index of users on brewGet.');
  $scope.users = User.query();
}]);

/**
 * New
 * ROUTE /#!/users/new
 * TEMPLATE /partials/users/new.html
 */
brewGetControllers.controller('UserNewCtrl', ['$scope', 'Head', 'User', function ($scope, Head, User) {
  Head.title('Sign up');
  Head.description('Sign up for an account on brewGet.');
  $scope.user = new User();
}]);

/**
 * Authentication
 * ROUTE /#!/users/auth
 * TEMPLATE /partials/users/auth.html
 */
brewGetControllers.controller('UserAuthCtrl', ['$scope', 'Head', 'User', function ($scope, Head, User) {
  Head.title('Sign in');
  Head.description('Sign in to your brewGet account.');
  $scope.user = new User();
}]);
