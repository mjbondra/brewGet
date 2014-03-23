'use strict';

var app = angular.module('brewGet.controllers.chat', []);

/**
 * Chat index
 * ROUTE /#!/chat
 * TEMPLATE /partials/chat/index.html
 */
app.controller('chat.index', ['$scope', 'Head', 'SockJS', function ($scope, Head, SockJS) {
  Head.title('Chat');
  Head.description('Chat');
  var sockjs = SockJS.context('chat', {});
  $scope.$on('socket:chat', function (event, message) {
    $scope.messages.push(message);
    $scope.$apply();
  });
  $scope.post = function () {
    sockjs.send($scope.input);
    $scope.input = '';
  };
  $scope.messages = [];
}]);
