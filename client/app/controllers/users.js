'use strict';

var app = angular.module('brewGet.controllers.users', ['angularFileUpload']);

/**
 * User index
 * ROUTE /#!/users
 * TEMPLATE /partials/users/index.html
 */
app.controller('users.index', ['$scope', 'Head', 'User', 'ImageSelect', 'LocationParse', function ($scope, Head, User, ImageSelect, LocationParse) {
  Head.title('Users');
  Head.description('An index of users on brewGet.');
  $scope.ImageSelect = ImageSelect;
  $scope.LocationParse = LocationParse;
  $scope.users = User.query();
}]);

/**
 * User show
 * ROUTE /#!/users/:slug
 * TEMPLATE /partials/users/show.html
 */
app.controller('users.show', ['$scope', '$routeParams', 'Head', 'User', 'ImageSelect', 'LocationParse', function ($scope, $routeParams, Head, User, ImageSelect, LocationParse) {
  $scope.user = User.get({ slug: $routeParams.slug });
  $scope.ImageSelect = ImageSelect;
  $scope.LocationParse = LocationParse;
  if ($scope.user.$promise) {
    $scope.user.$promise.then(function (user) {
      Head.title(user.username || 'User not found');
      Head.description('User information for ' + user.username);
    }).catch(function () {
      Head.title('User not found');
      Head.description('User not found');
    });
  }
}]);

/**
 * Account settings
 * ROUTE /#!/account/settings
 * TEMPLATE /partials/users/edit.html
 */
app.controller('users.edit', ['$scope', '$upload', 'API', 'Head', 'User', 'Username', 'Slug', 'ImageSelect', function ($scope, $upload, API, Head, User, Username, Slug, ImageSelect) {
  Head.title('Account Details & Settings');
  Head.description('Edit the details and settings of your brewGet account.');
  $scope.slug = Slug(Username(), true);
  $scope.user = User.get({ slug: $scope.slug });
  $scope.ImageSelect = ImageSelect;
  $scope.loading = false;
  $scope.imageDelete = function () {
    API('users/' + $scope.slug + '/images', 'DELETE').success(function (data, status, headers, config) {
      $scope.user.images = [];
    });
  };
  $scope.onFileSelect = function ($files) {
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      $scope.upload = $upload.upload({
        url: 'api/users/' + $scope.slug + '/images',
        data: { myObj: $scope.myModelObj },
        file: file,
        fileFormDataName: 'image',
      }).progress(function (evt) {
        // $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
      }).success(function (data, status, headers, config) {
        $scope.user.images = data;
      });
    }
  };
}]);

/**
 * Account sign in
 * ROUTE /#!/account/sign-in
 * TEMPLATE /partials/users/session.html
 */
app.controller('users.session', ['$scope', 'Head', 'User', function ($scope, Head, User) {
  Head.title('Sign in');
  Head.description('Sign in to your brewGet account.');
  $scope.user = new User();
}]);

/**
 * Account sign up
 * ROUTE /#!/account/sign-up
 * TEMPLATE /partials/users/new.html
 */
app.controller('users.new', ['$scope', 'Head', 'User', function ($scope, Head, User) {
  Head.title('Sign up');
  Head.description('Sign up for an account on brewGet.');
  $scope.user = new User();
}]);

/**
 * Account activity
 * ROUTE /#!/account/activity
 * TEMPLATE /partials/users/activity.html
 */
app.controller('users.activity', ['$scope', 'Head', function ($scope, Head) {
  Head.title('Activity');
  Head.description('Activity');
}]);
