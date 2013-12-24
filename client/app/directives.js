'use strict';

  ////////////////
 // DIRECTIVES //
////////////////

var app = angular.module('brewGet.directives', []);

/**
 * <global-messages> Directive
 */
app.directive('globalMessages', ['MessageHandler', '_', function (MessageHandler, _) {
  return {
    restrict: 'E',
    scope: true,
    link: function (scope) {
      scope.$on('globalMessages', function (event, globalMessages) { 
        scope = _.extend(scope, MessageHandler.process(globalMessages));
      });
      scope.hideMessages = function () {
        scope.cssClasses = [];
      };
    },
    templateUrl: '/app/views/directives/messages.html'
  };
}]);

/**
 * <validation-messages> Directive
 */
app.directive('validationMessages', ['MessageHandler', '_', function (MessageHandler, _) {
  return {
    restrict: 'E',
    scope: true,
    link: function (scope) {
      scope.$on('validationErrors', function (event, validationErrors) { 
        scope = _.extend(scope, MessageHandler.process(validationErrors));
      });
      scope.hideMessages = function () {
        scope.cssClasses = [];
      };
    },
    templateUrl: '/app/views/directives/messages.html'
  };
}]);
