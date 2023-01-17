const router = require("express").Router()

const { Blog } = require("../models")

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post("/", async (req, res, next) => {
  await Blog.create(req.body)
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

router.delete("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.destroy()
  } else {
    res.status(404).end()
  }
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
