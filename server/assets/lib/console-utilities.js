
/**
 * A collection of global functions that pertain to the console
 */

/**
 * Module dependencies
 */
var _ = require('underscore')
  , env = process.env.NODE_ENV || 'development';

var month = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec' 
}

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
var argParser = function (arg, opts) {
  var logStr = '';
  if (typeof arg === 'object') {

    // array
    if (_.isArray(arg)) {
      logStr = logStr + opts.delimiter + '[ ' + color.reset;
      arg.forEach(function (value, cnt) {
        if (cnt !== 0) logStr = logStr + opts.delimiter + ', ' + color.reset;
        if (_.isArray(value)) logStr = logStr + argParser(value, opts);
        else if (typeof value === 'object') logStr = logStr + opts.delimiter + '{ ' + color.reset +  argParser(value, opts) + opts.delimiter + ' }' + color.reset;
        else if (typeof value === 'string') logStr = logStr + opts.str + '\'' + value + '\'' + color.reset;
        else if (typeof value === 'number') logStr = logStr + opts.int + value + color.reset;
        else if (typeof value === 'boolean') logStr = logStr + opts.bool + value + color.reset;
        else logStr = logStr + color.grey + typeof value + color.reset;
      });
      logStr = logStr + opts.delimiter + ' ]' + color.reset;
      return logStr; // return array string

    // object
    } else {
      var objKeys = Object.keys(arg);
      objKeys.forEach(function (key, cnt) {
        if (cnt !== 0) logStr = logStr + opts.delimiter + ', ' + color.reset;
        logStr = logStr + opts.key + key + ': ' + color.reset;
        if (_.isArray(arg[key])) logStr = logStr + argParser(arg[key], opts);
        else if (typeof arg[key] === 'object') logStr = logStr + opts.delimiter + '{ ' + color.reset +  argParser(arg[key], opts) + opts.delimiter + ' }' + color.reset;
        else if (typeof arg[key] === 'string') logStr = logStr + opts.str + '\'' + arg[key] + '\'' + color.reset;
        else if (typeof arg[key] === 'number') logStr = logStr + opts.int + arg[key] + color.reset;
        else if (typeof arg[key] === 'boolean') logStr = logStr + opts.bool + arg[key] + color.reset;
        else logStr = logStr + color.grey + typeof arg[key] + color.reset;
      });
      return logStr; // return object string
    }

  // string/number
  } else if (typeof arg === 'string' || typeof arg === 'number') {
    logStr = logStr + opts.msg + arg + color.reset;
    return logStr; // return string/number string
  }

  // all other types
  return logStr = logStr + color.grey + typeof arg + color.reset;
}

/**
 * Controller for additional console functions
 */
var inflector = function (args, opts) {
  var d = new Date();
  var dF = d.getDate() + ' ' + month[d.getMonth() + 1] + ' ' + d.getHours() + ':' + ( d.getMinutes().toString().length < 2 ? '0' + d.getMinutes() : d.getMinutes() ) + ':' + ( d.getSeconds().toString().length < 2 ? '0' + d.getSeconds() : d.getSeconds() );
  var logStr = dF + color.grey + ' - ' + color.reset;
  args = Array.prototype.slice.call(args, 0);
  args.forEach(function (arg, cnt) {
    logStr = logStr + argParser(arg, opts);
    if (cnt !== args.length - 1) logStr = logStr + opts.delimiter + ' - ' + color.reset;
  });
  console.log(logStr);
}

/**
 * Additional console functions
 */
console.success = function () {
  if (env === 'test') return;
  var opts = {
    bool: color.yellow,
    delimiter: color.grey,
    int: color.yellow,
    key: '',
    msg: color.green,
    str: color.green
  }
  inflector(arguments, opts);
}
console.failure = function () {
  if (env === 'test') return;
  var opts = {
    bool: color.red,
    delimiter: color.grey,
    int: color.red,
    key: color.red,
    msg: color.red,
    str: color.red
  }
  inflector(arguments, opts);
}
console.warning = function () {
  if (env === 'test') return;
  var opts = {
    bool: color.yellow,
    delimiter: color.grey,
    int: color.yellow,
    key: color.yellow,
    msg: color.yellow,
    str: color.yellow
  }
  inflector(arguments, opts);
}
