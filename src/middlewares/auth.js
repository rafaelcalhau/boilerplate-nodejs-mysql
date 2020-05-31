import { promisify } from 'util'
import jwt from 'jsonwebtoken'

export default async (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    return res
      .status(401)
      .json({
        message: 'Unauthorized request.',
        howToFix: 'You forgot to send your authorization token.'
      })
  }

  if (authorization.indexOf('Bearer') !== 0) {
    return res
      .status(401)
      .json({
        message: 'Malformatted token.',
        howToFix: 'Provide a valid authorization token.'
      })
  }

  const [, token] = authorization.split(' ')

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    req.userId = decoded.id
  } catch (err) {
    console.log('midlewares.auth', err.message)

    return res
      .status(401)
      .json({
        message: 'Invalid token.',
        howToFix: 'Provide a valid authorization token.'
      })
  }

  return next()
}
