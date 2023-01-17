const express = require("express")
const app = express()

const { PORT } = require("./util/config")
const { connectToDatabase } = require("./util/db")

const blogsRouter = require("./controllers/blogs")

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  return response.status(400).send({ error: "some error" })
}

app.use(express.json())

app.use("/api/blogs", blogsRouter)

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
