'use strict';

  /////////////
 // FILTERS //
/////////////

var app = angular.module('brewGet.filters', []);

/*------------------------------------*\
    DATE FILTERS
\*------------------------------------*/

/**
 * Day count array
 *
 * @param {number} input - a number of days (within a particular month)
 * @returns {array} - an array containing a numberical representation of each day in the number of days specified by the input param
 */
app.filter('dayArray', function() {
  return function (input) {
    var days = [];
    while (input--)
      days.push(input + 1);
    return days.reverse();
  };
});

/**
 * Two character string
 * 
 * @param {number|string} input - a number, which could be one OR two characters in length
 * @returns {string} - a two character length string equivalent to the input param
 */
app.filter('twoChars', function() {
  return function (input) {
    if (typeof input === 'number') input = input.toString();
    if (input.length === 1) input = '0' + input;
    return input;
  };
});
