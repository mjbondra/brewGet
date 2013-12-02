'use strict';

/** 
 * Controllers
 */
var brewGetControllers = angular.module('brewGetControllers', []);

/** controller that binds to values within the html head element */
brewGetControllers.controller('HeadCtrl', ['$scope', 'Head', function ($scope, Head) {
  $scope.Head = Head;
}]);

/** contextual nav controller */
brewGetControllers.controller('NavCtrl', ['$scope', 'Nav', function ($scope, Nav) {
  Nav.success(function (nav) {
    $scope.Nav = nav;
  });
}]);

/** homepage controller */
brewGetControllers.controller('HomeCtrl', ['$scope', 'Head', 'MikeData', function ($scope, Head, MikeData) {
  Head.setTitle('brewGet');
  Head.setDescription('brewGet is a web application designed to support the beer trading community');
  $scope.mikedata = MikeData.get({ resourceId: 'test' });
}]);

/**
 * User controllers
 */

/** user:index */
brewGetControllers.controller('UserIndexCtrl', ['$scope', 'Head', 'User', function ($scope, Head, User) {
  Head.setTitle('Users');
  Head.setDescription('An index of users on brewGet.');
  $scope.users = User.query();
}]);

/** user:new */
brewGetControllers.controller('UserNewCtrl', ['$scope', 'Head', 'User', function ($scope, Head, User) {
  Head.setTitle('Sign up');
  Head.setDescription('Sign up for an account on brewGet.');
  $scope.user = new User();
  // $scope.validationErrors = [{ field: 'test', message: 'test '}];
}]);

/** user:auth */
brewGetControllers.controller('UserAuthCtrl', ['$scope', 'Head', function ($scope, Head) {
  Head.setTitle('Sign in');
  Head.setDescription('Sign in to your brewGet account.');
}]);
