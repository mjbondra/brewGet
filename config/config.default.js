
/** LOCALIZE CONFIGURATION AND RENAME TO 'config.js' */

/**
 * Module dependencies.
 */
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')

module.exports = {
  development: {
    db: {
      host: 'dbhost',
      name: 'dbname'
    },
    root: rootPath,
    sessionSecret: 'secretString'
  },
  test: {
    db: {
      host: 'dbhost',
      name: 'dbname'
    },
    root: rootPath,
    sessionSecret: 'secretString'
  },
  production: {
    db: {
      host: 'dbhost',
      name: 'dbname'
    },
    root: rootPath,
    sessionSecret: 'secretString'
  }
}
