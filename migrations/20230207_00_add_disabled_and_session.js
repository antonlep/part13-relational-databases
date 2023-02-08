const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('users', 'disabled', {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    })
    await queryInterface.createTable('sessions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'id' },
      },
      token: {
        type: DataTypes.STRING,
      },
    })
    await queryInterface.addColumn('users', 'session_id', {
      type: DataTypes.INTEGER,
      references: { model: 'sessions', key: 'id' },
  })   
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'disabled')
    await queryInterface.removeColumn('users', 'session_id')
    await queryInterface.dropTable('sessions')
  },
}