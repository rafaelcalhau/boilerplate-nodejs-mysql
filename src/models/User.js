import Sequelize from 'sequelize'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../services/database'

const User = db.define('user', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  email: {
    type: Sequelize.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      customValidator (value) {
        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
          throw new Error('Invalid email address.')
        }
      }
    }
  },
  password: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  is_active: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  defaultScope: {
    attributes: { exclude: ['password'] }
  },
  engine: 'InnoDB',
  timestamps: true
})

User.beforeCreate(async user => {
  user.password = await bcrypt.hash(user.password, 8)
})

User.afterCreate(async user => {
  delete user.dataValues.password
})

User.beforeBulkUpdate(async user => {
  if (user.attributes.password) {
    user.attributes.password = await bcrypt.hash(user.attributes.password, 8)
  }
})

User.prototype.generateToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET)
}

User.prototype.verifyPassword = async function (password) {
  return bcrypt.compareSync(password, this.password, (err, result) => {
    if (err) {
      console.log('verifyPassword -> error:', err)
    }

    return result
  })
}

// User
//   .sync({ force: true })
//   .then(console.log)
//   .catch(err => console.log(err.message))

export default User
