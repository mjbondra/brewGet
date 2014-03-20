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
  SockJS();
}]);
