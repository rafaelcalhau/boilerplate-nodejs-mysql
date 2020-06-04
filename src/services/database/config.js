const fs = require('fs')
const EnvironmentVariables = require('../../modules/dotenv')

// setting up the env variables
EnvironmentVariables().init()

const {
  ENVIRONMENT, DB_CERT_KEY, DB_CERT_FILE, DB_CERT_CA,
  DB_SERVER, DB_NAME, DB_USER, DB_PASSWORD
} = process.env

const dialectOptions = {
  bigNumberStrings: true,
  typeCast: function (field, next) {
    if (field.type === 'DATETIME' || field.type === 'TIMESTAMP') {
      return new Date(field.string() + 'Z')
    }

    return next()
  }
}

if (ENVIRONMENT === 'production') {
  dialectOptions.ssl = {
    ca: fs.readFileSync(DB_CERT_CA, 'utf8'),
    cert: fs.readFileSync(DB_CERT_FILE, 'utf8'),
    key: fs.readFileSync(DB_CERT_KEY, 'utf8')
  }
}

module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_SERVER,
    port: 3306,
    dialect: 'mysql',
    dialectOptions
  },
  production: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_SERVER,
    port: 3306,
    dialect: 'mysql',
    dialectOptions
  },
  test: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_SERVER,
    port: 3306,
    dialect: 'mysql',
    dialectOptions
  }
}
