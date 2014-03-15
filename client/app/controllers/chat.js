'use strict';

var app = angular.module('brewGet.controllers.chat', []);

/**
 * Chat index
 * ROUTE /#!/chat
 * TEMPLATE /partials/chat/index.html
 */
app.controller('chat.index', ['Head', function (Head) {
  Head.title('Chat');
  Head.description('Cbat');
}]);
