'use strict';

  /////////////////
 // CONTROLLERS //
/////////////////

var app = angular.module('brewGet.controllers', []);

/*------------------------------------*\
    GLOBAL CONTROLLERS
\*------------------------------------*/

/** 
 * Head Controller
 */
app.controller('HeadCtrl', ['$scope', 'Head', function ($scope, Head) {
  $scope.Head = Head;
}]);

/** 
 * Navigation Controller
 * TEMPLATE /partials/nav/index.html
 */
app.controller('NavCtrl', ['$scope', '$location', 'Nav', function ($scope, $location, Nav) {

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

  /** collapse expanded trees */
  var collapseTrees = function () {
    $scope.expandedTree = false;
  };
  collapseTrees();

  /** collapse trees on route change success */
  $scope.$on('$routeChangeSuccess', function () {
    collapseTrees();
  });

  /** set tree to expand based on passed context */
  $scope.expandTree = function (context) {
    if (context === $scope.expandedTree || typeof context === 'undefined') $scope.expandedTree = false;
    else $scope.expandedTree = context;
  }

  /** function used to determine expanded tree */
  $scope.isExpanded = function (context) {
    if (context === $scope.expandedTree) return true;
    else return false;
  }

  /** function used to determine active path */
  $scope.isActive = function (href) {
    if (href === $location.path()) return true;
    else return false;
  }

}]);

/** 
 * TEMPORARY
 * Homepage Controller !!! This is temporary and will be removed !!!
 * ROUTE /#!/
 * TEMPLATE /partials/home.html
 */
app.controller('HomeCtrl', ['$scope', '$cookies', 'Head', 'MikeData', function ($scope, $cookies, Head, MikeData) {
  Head.title('brewGet');
  Head.description('brewGet is a web application that supports the non-monetary exchange of regionally-limited or otherwise difficult to acquire beer.');
  console.log('cookies', $cookies);
  $cookies.myFavorite = 'oatmeal';
  $scope.mikedata = MikeData.get({ resourceId: 'test' });
}]);

/*------------------------------------*\
    USER/ACCOUNT CONTROLLERS
\*------------------------------------*/

/**
 * User index
 * ROUTE /#!/users
 * TEMPLATE /partials/users/index.html
 */
app.controller('UserIndex', ['$scope', 'Head', 'User', function ($scope, Head, User) {
  Head.title('Users');
  Head.description('An index of users on brewGet.');
  $scope.users = User.query();
}]);

/**
 * Account sign up
 * ROUTE /#!/account/sign-up
 * TEMPLATE /partials/account/sign-up.html
 */
app.controller('AccountSignUp', ['$scope', 'Head', 'User', function ($scope, Head, User) {
  Head.title('Sign up');
  Head.description('Sign up for an account on brewGet.');
  $scope.user = new User();
}]);

/**
 * Account settings
 * ROUTE /#!/account/settings
 * TEMPLATE /partials/account/settings.html
 */
app.controller('AccountSettings', ['$scope', 'Head', 'User', function ($scope, Head, User) {
  Head.title('Account Details & Settings');
  Head.description('Edit the details and settings of your brewGet account.');
}]);

/**
 * Account sign in
 * ROUTE /#!/account/sign-in
 * TEMPLATE /partials/account/sign-in.html
 */
app.controller('AccountSignIn', ['$scope', 'Head', 'User', function ($scope, Head, User) {
  Head.title('Sign in');
  Head.description('Sign in to your brewGet account.');
  $scope.user = new User();
}]);
