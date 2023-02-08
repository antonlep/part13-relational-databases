const jwt = require("jsonwebtoken")
const router = require("express").Router()

const { Blog, User, Session } = require("../models")
const { SECRET } = require("../util/config")
const { Op } = require("sequelize")

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("Authorization")
  console.log(authorization)
  console.log(jwt.verify(authorization.substring(7), SECRET))
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: "token invalid" })
    }
  } else {
    return res.status(401).json({ error: "token missing" })
  }
  next()
}

router.get("/", async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: "%" + req.query.search + "%",
          },
        },
        {
          author: {
            [Op.iLike]: "%" + req.query.search + "%",
          },
        },
      ],
    }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    order: [["likes", "desc"]],
    where,
  })
  res.json(blogs)
})

router.post("/", tokenExtractor, async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  const authorization = req.get('authorization')
  const originalToken = authorization.substring(7)
  const tokens = await Session.findAll({where: {userId: req.decodedToken.id}})
  const tokenlist = tokens.map(obj => obj.dataValues.token) 
  if (!tokenlist.includes(originalToken)) {
    return res.status(400).json("unauthorized")
  }
  await Blog.create({
    ...req.body,
    userId: user.id,
  })
    .then((blog) => {
      if (blog) {
        res.json(blog)
      } else {
        res.status(400).json({ error })
      }
    })
    .catch((error) => next(error))
})

router.get("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.delete("/:id", blogFinder, tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!req.blog) {
    return res.status(404).end()
  }
  if (user.id !== req.blog.userId) {
    return res.status(400).json("Unauthorized")
  }
  req.blog.destroy()
})

router.put("/:id", blogFinder, async (req, res, next) => {
  await Blog.findByPk(req.params.id)
    .then(async (blog) => {
      blog.likes = req.body.likes
      await blog.save()
      res.json(blog)
    })
    .catch((error) => next(error))
})

module.exports = router
