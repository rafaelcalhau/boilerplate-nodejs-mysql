const dotenv = require('dotenv')

module.exports = function EnvironmentVariables () {
  function init () {
    dotenv.config({
      path: process.env.NODE_ENV === 'production'
        ? '.env'
        : (process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.test')
    })
  }

  return {
    init
  }
}
