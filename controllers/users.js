const router = require("express").Router()

const { User, Blog, UserReadings } = require("../models")

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      as: 'read_blogs',
      attributes: { exclude: ["userId"]},
      through: {
        attributes: ["id", "read"]
      }
    },
  })
  res.json(users)
})

router.post("/", async (req, res, next) => {
  await User.create(req.body)
    .then((user) => res.json(user))
    .catch((error) => next(error))
})

router.get("/:id", async (req, res) => {
    const user = await User.findByPk(req.params.id, {
      include: {
        model: Blog,
        as: 'read_blogs',
        attributes: { exclude: ["userId"]},
        through: {
          attributes: ["id", "read"]
        },
      },
    })
    if (user) {
  let read_blogs = {}
    if (req.query.read === "true") {
      read_blogs = user.read_blogs.filter(blog => blog.dataValues.user_readings.dataValues.read === true)
    } else if (req.query.read === "false") {
      console.log(user.read_blogs[0].dataValues.user_readings.dataValues.read)
      read_blogs = user.read_blogs.filter(blog => blog.dataValues.user_readings.dataValues.read === false)
    } else {
      read_blogs = user.read_blogs
    }
    const result = {
      username: user.username,
      name: user.name,
      read_blogs: read_blogs
    }
    res.json(result)
  } else {
    res.status(404).end()
  }
  })

router.put("/:username", async (req, res, next) => {
  await User.findOne({ where: { username: req.params.username } })
    .then(async (user) => {
      user.username = req.body.username
      await user.save()
      res.json(user)
    })
    .catch((error) => next(error))
})

module.exports = router
