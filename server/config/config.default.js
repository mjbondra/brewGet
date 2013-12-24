
/** LOCALIZE CONFIGURATION AND RENAME TO 'config.js' */

/**
 * Module dependencies.
 */
var path = require('path')
  , port = process.env.PORT || 3000
  , rootPath = path.normalize(__dirname + '/../..')

module.exports = {
  development: {
    db: {
      host: 'dbhost',
      name: 'dbname'
    },
    env: 'development',
    port: port,
    root: rootPath,
    secrets: ['secretString']
  },
  test: {
    db: {
      host: 'dbhost',
      name: 'dbname'
    },
    env: 'test',
    port: port,
    root: rootPath,
    secrets: ['secretString']
  },
  production: {
    db: {
      host: 'dbhost',
      name: 'dbname'
    },
    env: 'production',
    port: port,
    root: rootPath,
    secrets: ['secretString']
  }
}
