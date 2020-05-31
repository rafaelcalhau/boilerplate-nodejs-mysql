import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import routes from './routes'

let application

const App = function () {
  if (!application) {
    dotenv.config({
      path: process.env.NODE_ENV === 'test'
        ? '.env.test'
        : (process.env.NODE_ENV === 'development' ? '.env.dev' : '.env')
    })

    application = express()

    // disabling the flag for security purposes
    application.disable('x-powered-by')

    // middlewares
    application.use(helmet())
    application.use(express.json())
    application.use(cors())

    // initialize the routes
    routes(application)
  }

  return application
}

export default App()
