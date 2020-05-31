import UserController from '../../controllers/UserController'
import AuthMiddleware from '../../middlewares/auth'

export default (routes) => {
  routes
    .use(AuthMiddleware)

  routes
    .delete('/users/:id', UserController.delete)
    .get('/users', UserController.index)
    .put('/users/:id', UserController.update)
    // .post('/users', UserController.store) // available as a public route
}
