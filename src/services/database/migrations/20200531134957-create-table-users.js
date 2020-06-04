'use strict'

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Date.now
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users')
  }
}
