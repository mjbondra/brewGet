'use strict';

var app = angular.module('brewGet.controllers.chat', []);

/**
 * Chat index
 * ROUTE /#!/chat
 * TEMPLATE /partials/chat/index.html
 */
app.controller('chat.index', ['$scope', 'Head', 'Session', 'SockJS', function ($scope, Head, Session, SockJS) {
  Head.title('Chat');
  Head.description('Chat');
  var sockjs = SockJS();
  sockjs.onmessage = function (e) {
    $scope.messages.push(e.data);
    $scope.$apply();
  };
  $scope.messages = [];
  $scope.post = function () {
    sockjs.send(Session() + ' - ' + $scope.input);
    $scope.input = '';
  };
}]);
