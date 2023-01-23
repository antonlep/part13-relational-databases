const router = require("express").Router()

const { Blog } = require("../models")
const { sequelize } = require("../util/db")

router.get("/", async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      "author",
      [sequelize.fn("SUM", sequelize.col("likes")), "likes"],
      [sequelize.fn("COUNT", sequelize.col("id")), "articles"],
    ],
    group: "author",
  })
  res.json(authors)
})

module.exports = router
