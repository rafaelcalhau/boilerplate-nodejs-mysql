import AuthController from '../../controllers/AuthController'
import UserController from '../../controllers/UserController'

export default (routes) => {
  routes
    .post('/authenticate', AuthController.authenticate)
    .post('/users', UserController.store)
}
