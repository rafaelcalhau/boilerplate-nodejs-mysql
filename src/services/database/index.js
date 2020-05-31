import dotenv from 'dotenv'
import fs from 'fs'
import Sequelize from 'sequelize'

dotenv.config({
  path: process.env.NODE_ENV === 'test'
    ? '.env.test'
    : (process.env.NODE_ENV === 'development' ? '.env.dev' : '.env')
})

let connection
const {
  ENVIRONMENT, DB_CERT_KEY, DB_CERT_FILE, DB_CERT_CA,
  DB_SERVER, DB_NAME, DB_USER, DB_PASSWORD
} = process.env

const dialectOptions = {
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

try {
  connection = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_SERVER,
    dialect: 'mysql',
    dialectOptions,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '-03:00'
  })
} catch (err) {
  console.log(`@Exception on DB connection: ${err.message}`)
}

export default connection
