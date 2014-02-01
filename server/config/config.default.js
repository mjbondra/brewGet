
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
      host: 'localhost',
      db: 'db_dev'
    },
    path: {
      root: rootPath,
      static: rootPath + '/client',
      tmp: rootPath + '/server/assets/tmp',
      upload: rootPath + '/client/assets/img'
    },
    port: port,
    secrets: ['secretString']
  },
  test: {
    env: 'test',
    mongo: {
      host: 'localhost',
      db: 'db_test'
    },
    path: {
      root: rootPath,
      static: rootPath + '/client',
      tmp: rootPath + '/server/assets/tmp',
      upload: rootPath + '/client/assets/img'
    },
    port: port,
    secrets: ['secretString']
  },
  production: {
    env: 'production',
    mongo: {
      host: 'localhost',
      db: 'db_prod'
    },
    path: {
      root: rootPath,
      static: rootPath + '/client',
      tmp: rootPath + '/server/assets/tmp',
      upload: rootPath + '/client/assets/img'
    },
    port: port,
    secrets: ['secretString']
  }
}
