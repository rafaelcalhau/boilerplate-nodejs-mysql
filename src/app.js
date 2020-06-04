import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import routes from './routes'
import EnvironmentVariables from './modules/dotenv'

let application

const App = function () {
  if (!application) {
    // setting up the env variables
    EnvironmentVariables().init()

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
