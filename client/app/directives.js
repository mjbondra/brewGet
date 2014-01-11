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

/**
 * <input-date> Directive
 *
 * @param {string} [attrs.label=Date] - label for form elements
 * @param {object} [attrs.formObject=form] - name of form object in parent scope to which data should be attached
 * @param {object} [attrs.dateContainer=date] - name of object that should contain the date within the parent scope object
 */
app.directive('inputDate', ['DateHandler', '_', function (DateHandler, _) {
  return {
    restrict: 'E',
    scope: true,
    link: function (scope, element, attrs) {
      scope = _.extend(scope, DateHandler);
      scope.label = attrs.label || 'Date';
      scope.days = function () {
        // return number of days in a given month during a given year (accounts for leap year variations of February)
        return scope.months[( scope.month ? parseInt(scope.month) - 1 : 0 )].dayCount + ( ( 0 === ( scope.year ? parseInt(scope.year) % 4 : 0 ) ) && parseInt(scope.month) === 2 ? 1 : 0 );
      }
      scope.getDate = function () {
        var date;
        if (scope.month && scope.day && scope.year) date = new Date(parseInt(scope.year), parseInt(scope.month) - 1, parseInt(scope.day));
        else date = '';
        scope[attrs.formObject || 'form'][attrs.dateContainer || 'date'] = date;
        return date;
      }
    },
    templateUrl: '/app/views/directives/input-date.html'
  };
}]);
