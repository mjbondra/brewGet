'use strict';

/** 
 * Controllers
 */
var brewGetControllers = angular.module('brewGetControllers', []);

/** controller that binds to values within the html head element */
brewGetControllers.controller('HeadCtrl', ['$scope', 'Head', function ($scope, Head) {
    $scope.Head = Head;
}]);

/** homepage controller */
brewGetControllers.controller('HomeCtrl', ['$scope', 'Head', function ($scope, Head) {
    Head.setTitle('brewGet');
    Head.setDescription('brewGet is a web application designed to support the beer trading community');
}]);
