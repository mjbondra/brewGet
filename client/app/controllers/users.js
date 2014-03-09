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
 * ROUTE /#!/users/:username
 * TEMPLATE /partials/users/show.html
 */
app.controller('users.show', ['$scope', '$routeParams', 'Head', 'User', 'ImageSelect', 'LocationParse', function ($scope, $routeParams, Head, User, ImageSelect, LocationParse) {
  $scope.user = User.get({ username: $routeParams.username });
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
app.controller('users.edit', ['$scope', '$upload', 'API', 'Head', 'User', 'Session', 'Slug', 'ImageSelect', function ($scope, $upload, API, Head, User, Session, Slug, ImageSelect) {
  Head.title('Account Details & Settings');
  Head.description('Edit the details and settings of your brewGet account.');
  $scope.username = Slug(Session(), true);
  $scope.user = User.get({ username: $scope.username });
  $scope.ImageSelect = ImageSelect;
  $scope.loading = false;

  // functions
  $scope.imageDelete = function () {
    API('users/' + $scope.username + '/images', 'DELETE').success(function (data, status, headers, config) {
      $scope.user.images = [];
    });
  };
  $scope.onFileSelect = function ($files) {
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      $scope.upload = $upload.upload({
        url: 'api/users/' + $scope.username + '/images',
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
  $scope.update = function (query) {
    if (typeof $scope.user.location === 'string') $scope.user.location = {
      name: $scope.user.location
    };
    $scope.user.$update(query);
  };

  // promises
  if ($scope.user.$promise) {
    $scope.user.$promise.then(function (user) {
      if (user.location && user.location.name) $scope.user.location = user.location.name;
      else $scope.user.location = '';
    });
  }
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

  // functions
  $scope.save = function () {
    if (typeof $scope.user.location === 'string') $scope.user.location = {
      name: $scope.user.location
    };
    $scope.user.$save();
  };
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
