'use strict';

var app = angular.module('brewGet.controllers.messages', []);

/**
 * Post index
 * ROUTE /#!/
 * TEMPLATE /partials/posts/index.html
 */
app.controller('messages.index', ['$scope', 'Head', function ($scope, Head) {
  Head.title('Messages');
  Head.description('Messages');
}]);

/**
 * Post show
 * ROUTE /#!/
 * TEMPLATE /partials/posts/show.html
 */
app.controller('messages.show', ['$scope', 'Head', function ($scope, Head) {
  Head.title('Message');
  Head.description('Message');
}]);

/**
 * Post new
 * ROUTE /#!/
 * TEMPLATE /partials/posts/new.html
 */
app.controller('messages.new', ['$scope', 'Head', function ($scope, Head) {
  Head.title('New Message');
  Head.description('New Message');
}]);

/**
 * Post edit
 * ROUTE /#!/
 * TEMPLATE /partials/posts/edit.html
 */
app.controller('messages.edit', ['$scope', 'Head', function ($scope, Head) {
  Head.title('Edit Message');
  Head.description('Edit Message');
}]);
