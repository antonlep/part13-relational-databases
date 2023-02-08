const Blog = require("./blog")
const User = require("./user")
const Session = require("./session")
const UserReadings = require("./user_readings")

User.hasMany(Blog)
Blog.belongsTo(User)

User.hasMany(Session)
Session.belongsTo(User)

User.belongsToMany(Blog, { through: UserReadings, as: 'read_blogs' })
Blog.belongsToMany(User, { through: UserReadings, as: 'users_read' })

module.exports = {
  Blog,
  User,
  UserReadings,
  Session
}
