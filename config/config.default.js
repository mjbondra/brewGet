
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
    secrets: {
      cookie: 'secretString',
      session: 'secretString'
    }
  },
  test: {
    db: {
      host: 'dbhost',
      name: 'dbname'
    },
    root: rootPath,
    secrets: {
      cookie: 'secretString',
      session: 'secretString'
    }
  },
  production: {
    db: {
      host: 'dbhost',
      name: 'dbname'
    },
    root: rootPath,
    secrets: {
      cookie: 'secretString',
      session: 'secretString'
    }
  }
}
