'use strict';

  ////////////////
 // DIRECTIVES //
////////////////

var app = angular.module('brewGet.directives', []);

/*------------------------------------*\
    ELEMENTAL DIRECTIVES
\*------------------------------------*/

/*--Content Directives--*/

/**
 * <beer> Directive
 */
app.directive('beer', ['CoverImageSelect', 'LocationParse', function (CoverImageSelect, LocationParse) {
  return {
    restrict: 'E',
    scope: true,
    link: function (scope) {
      scope.CoverImageSelect = CoverImageSelect;
      scope.LocationParse = LocationParse;
    },
    templateUrl: '/app/views/beers/directive.html'
  };
}]);

/**
 * <brewery> Directive
 */
app.directive('brewery', ['CoverImageSelect', 'LocationParse', function (CoverImageSelect, LocationParse) {
  return {
    restrict: 'E',
    scope: true,
    link: function (scope) {
      scope.CoverImageSelect = CoverImageSelect;
      scope.LocationParse = LocationParse;
    },
    templateUrl: '/app/views/breweries/directive.html'
  };
}]);

/**
 * <location> Directive
 */
app.directive('location', ['LocationParse', function (LocationParse) {
  return {
    restrict: 'E',
    scope: true,
    link: function (scope) {
      scope.LocationParse = LocationParse;
    },
    templateUrl: '/app/views/locations/directive.html'
  };
}]);

/**
 * <beer-style> Directive
 */
app.directive('beerStyle', ['LocationParse', function (LocationParse) {
  return {
    restrict: 'E',
    scope: true,
    link: function (scope) {
      scope.LocationParse = LocationParse;
    },
    templateUrl: '/app/views/styles/directive.html'
  };
}]);


/**
 * <user> Directive
 */
app.directive('user', ['UserImageSelect', 'LocationParse', function (UserImageSelect, LocationParse) {
  return {
    restrict: 'E',
    scope: true,
    link: function (scope) {
      scope.UserImageSelect = UserImageSelect;
      scope.LocationParse = LocationParse;
    },
    templateUrl: '/app/views/users/directive.html'
  };
}]);

/*--Message Directives--*/

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

/*--Input Directives--*/

/**
 * <input-date> Directive
 *
 * @param {string} [attrs.label=Date] - label for form elements
 * @param {object} [attrs.formObject=form] - name of form object in parent scope to which data should be attached
 * @param {object} [attrs.dateContainer=date] - name of object that should contain the date within the parent scope object
 */
app.directive('inputDate', ['DateHandler', '_', function (DateHandler, _) {
  var date;
  return {
    restrict: 'E',
    scope: true,
    link: function (scope, element, attrs) {
      scope = _.extend(scope, DateHandler);
      scope.label = attrs.label || 'Date';
      scope.days = function () {
        // return number of days in a given month during a given year (accounts for leap year variations of February)
        return scope.months[( scope.month ? parseInt(scope.month) : 0 )].dayCount + ( ( 0 === ( scope.year ? parseInt(scope.year) % 4 : 0 ) ) && parseInt(scope.month) === 1 ? 1 : 0 );
      };
      scope.getDate = function () {
        if (scope.month && scope.day && scope.year) date = new Date(parseInt(scope.year), parseInt(scope.month), parseInt(scope.day));
        else if (!scope.month && !scope.day && !scope.year && typeof scope[attrs.formObject || 'form'][attrs.dateContainer || 'date'] === 'string') {
          date = new Date(scope[attrs.formObject || 'form'][attrs.dateContainer || 'date']);
          scope.month = date.getMonth();
          scope.day = date.getDate();
          scope.year = date.getFullYear();
        }
        else date = null;
        scope[attrs.formObject || 'form'][attrs.dateContainer || 'date'] = date;
        return date;
      };
    },
    templateUrl: '/app/views/directives/input-date.html'
  };
}]);

/*------------------------------------*\
    ATTRIBUTIONAL DIRECTIVES
\*------------------------------------*/

/**
 * Places API Directive
 *
 * ex. <input type="text" id="location" places types="(cities)">
 *
 * @param {string} attrs.id - id attribute of input element with places-location attribute
 * @param {string} [attrs.types=geocode] - types of locations for which the Places API should query
 */
app.directive('places', ['PlacesAPI', function (PlacesAPI) {
  return {
    scope: {
      ngModel: '='
    },
    link: function (scope, element, attrs) {
      attrs.types = attrs.types || 'geocode';
      PlacesAPI.setElementByID(attrs.id, attrs.types);
      scope.$on(attrs.id, function (event, place) {

        var _place = {
          name: element.val()
        };

        if (place.address_components) {
          var i = place.address_components.length;

          while (i--) {
            if (place.address_components[i].types[0] === 'locality') {
              _place.city = {};
              _place.city.name = place.address_components[i].long_name;
            }
            else if (place.address_components[i].types[0] === 'administrative_area_level_1') {
              _place.state = {};
              _place.state.abbreviation = place.address_components[i].short_name;
              _place.state.name = place.address_components[i].long_name;
            }
            else if (place.address_components[i].types[0] === 'country') {
              _place.country = {};
              _place.country.abbreviation = place.address_components[i].short_name;
              _place.country.name = place.address_components[i].long_name;
            }
          }
        }

        if (place.geometry && place.geometry.location) {
          _place.geometry = {};
          _place.geometry.latitude = place.geometry.location.lat();
          _place.geometry.longitude = place.geometry.location.lng();
        }

        scope.ngModel = _place;
        scope.$apply('ngModel');
      });
    }
  };
}]);
