'use strict';

/** 
 * Directives
 */
var brewGetDirectives = angular.module('brewGetDirectives', []);

/** reusable directive for form validation messages */
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
