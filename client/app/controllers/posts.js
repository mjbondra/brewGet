'use strict';

var app = angular.module('brewGet.controllers.posts', []);

/**
 * Post index
 * ROUTE /#!/
 * TEMPLATE /partials/posts/index.html
 */
app.controller('posts.index', ['$scope', 'Head', function ($scope, Head) {
  Head.title('Posts');
  Head.description('Posts');
}]);

/**
 * Post show
 * ROUTE /#!/
 * TEMPLATE /partials/posts/show.html
 */
app.controller('posts.show', ['$scope', 'Head', function ($scope, Head) {
  Head.title('Post');
  Head.description('Post');
}]);

/**
 * Post new
 * ROUTE /#!/
 * TEMPLATE /partials/posts/new.html
 */
app.controller('posts.new', ['$scope', 'Head', function ($scope, Head) {
  Head.title('New Post');
  Head.description('New Post');
}]);

/**
 * Post edit
 * ROUTE /#!/
 * TEMPLATE /partials/posts/edit.html
 */
app.controller('posts.edit', ['$scope', 'Head', function ($scope, Head) {
  Head.title('Edit Post');
  Head.description('Edit Post');
}]);
