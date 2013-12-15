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
  var loadNav = function () {
    Nav().success(function (nav) {
      $scope.Nav = nav;
    });
  };
  loadNav();

  /** reload nav on 'reloadNav' event */
  $scope.$on('reloadNav', function () {
    loadNav();
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
 * TEMPORARY
 * Homepage Controller !!! This is temporary and will be removed !!!
 * ROUTE /#!/
 * TEMPLATE /partials/home.html
 */
brewGetControllers.controller('HomeCtrl', ['$scope', '$cookies', 'Head', 'MikeData', function ($scope, $cookies, Head, MikeData) {
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
 * ROUTE /#!/account/sign-up
 * TEMPLATE /partials/account/sign-up.html
 */
brewGetControllers.controller('UserNewCtrl', ['$scope', 'Head', 'User', function ($scope, Head, User) {
  Head.title('Sign up');
  Head.description('Sign up for an account on brewGet.');
  $scope.user = new User();
}]);

/**
 * Edit
 * ROUTE /#!/account/settings
 * TEMPLATE /partials/account/settings.html
 */
brewGetControllers.controller('UserEditCtrl', ['$scope', 'Head', 'User', function ($scope, Head, User) {
  Head.title('Account Details & Settings');
  Head.description('Edit the details and settings of your brewGet account.');
}]);

/**
 * Authentication
 * ROUTE /#!/account/sign-in
 * TEMPLATE /partials/account/sign-in.html
 */
brewGetControllers.controller('UserAuthCtrl', ['$scope', 'Head', 'User', function ($scope, Head, User) {
  Head.title('Sign in');
  Head.description('Sign in to your brewGet account.');
  $scope.user = new User();
}]);
