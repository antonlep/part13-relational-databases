const jwt = require("jsonwebtoken")
const router = require("express").Router()

const { SECRET } = require("../util/config")
const {User, Session} = require("../models")
const { tokenExtractor } = require('../util/middleware')

router.delete("/",  tokenExtractor, async (req, res) => {
  const userId = req.decodedToken.id
  const user = await Session.destroy({
    where: {
      userId: userId,
    },
  })
  res.status(200).json("logged out")
})

module.exports = router
