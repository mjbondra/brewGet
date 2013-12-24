
/**
 * A collection of global functions that pertain to the console
 */

/**
 * Module dependencies
 */
var _ = require('underscore');

/**
 * Colors available to console functions
 */
var color = {
  white: '\x1B[37m',
  grey: '\x1B[90m',
  black: '\x1B[30m',
  blue: '\x1B[34m',
  cyan: '\x1B[36m',
  green: '\x1B[32m',
  magenta: '\x1B[35m',
  red: '\x1B[31m',
  yellow: '\x1B[33m',
  reset: '\x1B[39m'
}

/**
 * Argument parser for additional console functions
 */
var argParser = function (arg, clr) {
  var logStr = '';
  if (typeof arg === 'object') {

    // array
    if (_.isArray(arg)) {
      logStr = logStr + '[ ';
      arg.forEach(function (value, cnt) {
        if (cnt !== 0) logStr = logStr + ', ';
        if (_.isArray(value)) logStr = logStr + argParser(value);
        else if (typeof value === 'object') logStr = logStr + '{ ' +  argParser(value) + ' }';
        else if (typeof value === 'string' || typeof value === 'number') logStr = logStr + color.yellow + value + color.reset;
        else logStr = logStr + color.grey + typeof value + color.reset;
      });
      logStr = logStr + ' ]';
      return logStr; // return array string

    // object
    } else {
      var objKeys = Object.keys(arg);
      objKeys.forEach(function (key, cnt) {
        if (cnt !== 0) logStr = logStr + ', ';
        logStr = logStr + key + ': ';
        if (_.isArray(arg[key])) logStr = logStr + argParser(arg[key]);
        else if (typeof arg[key] === 'object') logStr = logStr + '{ ' +  argParser(arg[key]) + ' }';
        else if (typeof arg[key] === 'string' || typeof arg[key] === 'number') logStr = logStr + color.yellow + arg[key] + color.reset;
        else logStr = logStr + color.grey + typeof arg[key] + color.reset;
      });
      return logStr; // return object string
    }

  // string/number
  } else if (typeof arg === 'string' || typeof arg === 'number') {
    logStr = logStr + clr + arg + color.reset;
    return logStr; // return string/number string
  }

  // all other types
  return logStr = logStr + color.grey + typeof arg + color.reset;
}

/**
 * Controller for additional console functions
 */
var inflector = function (args, clr) {
  var logStr = '';
  args = Array.prototype.slice.call(args, 0);
  args.forEach(function (arg, cnt) {
    logStr = logStr + argParser(arg, clr);
    if (cnt !== args.length - 1) logStr = logStr + color.grey + ' -- ' + color.reset;
  });
  console.log(logStr);
}

/**
 * Additional console functions
 */
console.success = function () {
  inflector(arguments, color.green);
}
console.failure = function () {
  inflector(arguments, color.red);
}
console.warning = function () {
  inflector(arguments, color.yellow);
}
