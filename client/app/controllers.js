'use strict';

  /////////////////
 // CONTROLLERS //
/////////////////

var app = angular.module('brewGet.controllers', ['angularFileUpload']);

/*------------------------------------*\
    GLOBAL CONTROLLERS
\*------------------------------------*/

/** 
 * Head Controller
 */
app.controller('html.head', ['$scope', 'Head', function ($scope, Head) {
  $scope.Head = Head;
}]);

/** 
 * Navigation Controller
 * TEMPLATE /partials/nav/index.html
 */
app.controller('html.nav', ['$scope', '$location', 'API', function ($scope, $location, API) {

  // load nav
  var loadNav = function () {
    API('api/nav').success(function (data) {
      $scope.Nav = data;
    });
  };
  loadNav();

  // reload nav on 'reloadNav' event
  $scope.$on('reloadNav', function () {
    loadNav();
  });

  // collapse expanded trees
  var collapseTrees = function () {
    $scope.expandedTree = false;
  };
  collapseTrees();

  // collapse trees on route change success
  $scope.$on('$routeChangeSuccess', function () {
    collapseTrees();
  });

  // set tree to expand based on passed context
  $scope.expandTree = function (context) {
    if (context === $scope.expandedTree || typeof context === 'undefined') $scope.expandedTree = false;
    else $scope.expandedTree = context;
  }

  // function used to determine expanded tree
  $scope.isExpanded = function (context) {
    if (context === $scope.expandedTree) return true;
    else return false;
  }

  // function used to determine active path
  $scope.isActive = function (href) {
    if (href === $location.path()) return true;
    else return false;
  }

}]);

/** 
 * TEMPORARY
 * Homepage Controller !!! This is temporary and will be removed !!!
 * ROUTE /#!/
 * TEMPLATE /partials/home.html
 */
app.controller('HomeCtrl', ['$scope', 'Head', 'MikeData', function ($scope, Head, MikeData) {
  Head.title('brewGet');
  Head.description('brewGet is a web application that supports the non-monetary exchange of regionally-limited or otherwise difficult to acquire beer.');
  $scope.mikedata = MikeData.get({ resourceId: 'test' });
}]);

/*------------------------------------*\
    USER/ACCOUNT CONTROLLERS
\*------------------------------------*/

/**
 * User index
 * ROUTE /#!/users
 * TEMPLATE /partials/users/index.html
 */
app.controller('users.index', ['$scope', 'Head', 'User', 'ImageSelect', function ($scope, Head, User, ImageSelect) {
  Head.title('Users');
  Head.description('An index of users on brewGet.');
  $scope.ImageSelect = ImageSelect;
  $scope.users = User.query();
}]);

/**
 * User show
 * ROUTE /#!/users/:slug
 * TEMPLATE /partials/users/show.html
 */
app.controller('users.show', ['$scope', '$routeParams', 'Head', 'User', 'ImageSelect', function ($scope, $routeParams, Head, User, ImageSelect) {
  $scope.user = User.get({ slug: $routeParams.slug });
  $scope.ImageSelect = ImageSelect;
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
 * TEMPLATE /partials/account/settings.html
 */
app.controller('users.edit', ['$scope', '$upload', 'API', 'Head', 'User', 'Username', 'Slug', 'ImageSelect', function ($scope, $upload, API, Head, User, Username, Slug, ImageSelect) {
  Head.title('Account Details & Settings');
  Head.description('Edit the details and settings of your brewGet account.');
  $scope.slug = Slug(Username(), true);
  $scope.user = User.get({ slug: $scope.slug });
  $scope.ImageSelect = ImageSelect;
  $scope.loading = false;

  $scope.imageDelete = function () {
    API('api/users/' + $scope.slug + '/images', 'DELETE').success(function (data, status, headers, config) {
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
 * TEMPLATE /partials/account/sign-in.html
 */
app.controller('users.session', ['$scope', 'Head', 'User', function ($scope, Head, User) {
  Head.title('Sign in');
  Head.description('Sign in to your brewGet account.');
  $scope.user = new User();
}]);

/**
 * Account sign up
 * ROUTE /#!/account/sign-up
 * TEMPLATE /partials/account/sign-up.html
 */
app.controller('users.new', ['$scope', 'Head', 'User', function ($scope, Head, User) {
  Head.title('Sign up');
  Head.description('Sign up for an account on brewGet.');
  $scope.user = new User();
}]);

/*------------------------------------*\
    POST CONTROLLERS
\*------------------------------------*/

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

/*------------------------------------*\
    MESSAGE CONTROLLERS
\*------------------------------------*/

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
