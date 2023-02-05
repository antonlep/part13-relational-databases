const router = require("express").Router()

const { UserReadings, User } = require("../models")
const { tokenExtractor } = require('../util/middleware')

router.post("/", async (req, res, next) => {
  const blogId = req.body.blogId
  const userId = req.body.userId
  await UserReadings.create({blogId: blogId, userId: userId})
    .then((user) => res.json(user))
    .catch((error) => next(error))
})


router.put("/:id", tokenExtractor, async (req, res, next) => {
  try {
    // const user = await User.findByPk(req.decodedToken.id)
    const reading = await UserReadings.findByPk(req.params.id)
    if (req.decodedToken.id === reading.userId) {
      reading.read = req.body.read
      await reading.save()
      res.json(reading)
    }
  } catch(error) {
    console.log(error)
    return res.status(400).json({ error })
  }
})

module.exports = router
