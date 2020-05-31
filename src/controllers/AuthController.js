import User from '../models/User'
import { handleCatchedError } from '../modules/utils'

class AuthController {
  async authenticate (req, res) {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const attributes = ['id', 'name', 'password']
    const user = await User
      .findOne({ where: { email }, attributes })
      .catch(err => handleCatchedError(res, err.message, 400))

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    } else {
      const isPasswordValid = await user.verifyPassword(password)

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Password invalid.' })
      }
    }

    delete user.dataValues.password
    return res.json({
      data: user.toJSON(),
      token: user.generateToken()
    })
  }
}

export default new AuthController()
