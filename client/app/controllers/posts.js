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
app.controller('posts.new', ['$scope', 'Head', 'Post', 'Autocomplete', 'CoverImageSelect', function ($scope, Head, Post, Autocomplete, CoverImageSelect) {
  Head.title('New Post');
  Head.description('New Post');
  $scope.post = new Post();
  $scope.post.beers = [{}];

  $scope.CoverImageSelect = CoverImageSelect;

  // functions
  $scope.addBeer = function () {
    $scope.post.beers.push({});
  };
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
          break;
      }
    }
  };
  $scope.applyAutocomplete = function (type, parentIndex, index) {
    switch (type) {
    case 'beers':
      if ($scope.post.beers[parentIndex].type) $scope.post.beers[parentIndex].autocomplete[index].type = $scope.post.beers[parentIndex].type;
      $scope.post.beers[parentIndex] = $scope.post.beers[parentIndex].autocomplete[index];
      break;
    case 'breweries':
      $scope.post.beers[parentIndex].brewery = $scope.post.beers[parentIndex].brewery.autocomplete[index];
      break;
    case 'styles':
      $scope.post.beers[parentIndex].style = $scope.post.beers[parentIndex].style.autocomplete[index];
      break;
    }
    if (type !== 'styles' && $scope.post.beers[parentIndex].brewery.location && $scope.post.beers[parentIndex].brewery.location.name) $scope.post.beers[parentIndex].brewery.location = $scope.post.beers[parentIndex].brewery.location.name;
  };
  $scope.save = function () {
    if ($scope.post.beers && $scope.post.beers.length > 0) {
      var i = $scope.post.beers.length;
      while (i--) if ($scope.post.beers[i].brewery && typeof $scope.post.beers[i].brewery.location === 'string') $scope.post.beers[i].brewery.location = {
        name: $scope.post.beers[i].brewery.location
      };
    }
    $scope.post.$save();
  };
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
