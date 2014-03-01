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
app.controller('posts.new', ['$scope', 'Head', 'Post', 'Autocomplete', function ($scope, Head, Post, Autocomplete) {
  Head.title('New Post');
  Head.description('New Post');
  $scope.post = new Post();
  $scope.post.beers = [{}];
  $scope.addBeer = function () {
    $scope.post.beers.push({});
  }
  $scope.Autocomplete = function (type, input, index) {
    if (input && input.length > 1) {
      Autocomplete(type, input).success(function (data) {
        switch (type) {
          case 'beers':
            $scope.post.beers[index].autocomplete = data;
            break;
          case 'breweries':
            $scope.post.beers[index].brewery.autocomplete = data;
            break;
          case 'styles':
            $scope.post.beers[index].style.autocomplete = data;
            break;
        }
      });
    } else {
      switch (type) {
        case 'beers':
          $scope.post.beers[index].autocomplete = [];
          break;
        case 'breweries':
          $scope.post.beers[index].brewery.autocomplete = [];
          break;
        case 'styles':
          $scope.post.beers[index].style.autocomplete = [];
      }
    }
  }
  $scope.applyBeer = function (parentIndex, index) {
    $scope.post.beers[parentIndex] = $scope.post.beers[parentIndex].autocomplete[index];
  }
  $scope.applyBrewery = function (parentIndex, index) {
    $scope.post.beers[parentIndex].brewery = $scope.post.beers[parentIndex].brewery.autocomplete[index];
  }
  $scope.applyStyle = function (parentIndex, index) {
    $scope.post.beers[parentIndex].style = $scope.post.beers[parentIndex].style.autocomplete[index];
  }
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
