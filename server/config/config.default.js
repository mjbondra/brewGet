
/** LOCALIZE CONFIGURATION AND RENAME TO 'config.js' */

/**
 * Module dependencies.
 */
var path = require('path')
  , port = process.env.PORT || 3000
  , rootPath = path.normalize(__dirname + '/../..')

module.exports = {
  development: {
    env: 'development',
    mongo: {
      host: 'dbhost',
      db: 'dbname'
    },
    path: {
      root: rootPath,
      static: rootPath + '/client',
      tmp: rootPath + '/server/assets/tmp'
    },
    port: port,
    secrets: ['secretString']
  },
  test: {
    env: 'test',
    mongo: {
      host: 'dbhost',
      db: 'dbname'
    },
    path: {
      root: rootPath,
      static: rootPath + '/client',
      tmp: rootPath + '/server/assets/tmp'
    },
    port: port,
    secrets: ['secretString']
  },
  production: {
    env: 'production',
    mongo: {
      host: 'dbhost',
      db: 'dbname'
    },
    path: {
      root: rootPath,
      static: rootPath + '/client',
      tmp: rootPath + '/server/assets/tmp'
    },
    port: port,
    secrets: ['secretString']
  }
}
