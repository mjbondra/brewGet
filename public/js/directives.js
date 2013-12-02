'use strict';

/** 
 * Directives
 */
var brewGetDirectives = angular.module('brewGetDirectives', []);

/** globally visible container for messages */
brewGetDirectives.directive('globalMessages', function () {
  return {
    restrict: 'E',
    link: function (scope) {
      scope.$on('globalMessages', function (event, globalMessages) { 
        scope.globalMessages = globalMessages;
      });
    },
    templateUrl: '/partials/directives/global-messages.html'
  };
});

/** reusable directive for form validation error messages */
brewGetDirectives.directive('validationMessages', function () {
  return {
    restrict: 'E',
    link: function (scope) {
      scope.$on('validationErrors', function (event, validationErrors) { 
        scope.validationErrors = validationErrors;
      });
    },
    templateUrl: '/partials/directives/validation-messages.html'
  };
});
