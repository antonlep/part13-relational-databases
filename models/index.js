const Blog = require("./blog")
const User = require("./user")
const UserReadings = require("./user_readings")

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: UserReadings, as: 'read_blogs' })
Blog.belongsToMany(User, { through: UserReadings, as: 'users_read' })

module.exports = {
  Blog,
  User,
  UserReadings
}
