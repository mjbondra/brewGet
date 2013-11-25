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
