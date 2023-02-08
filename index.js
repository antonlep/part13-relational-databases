const express = require("express")
const app = express()

const { PORT } = require("./util/config")
const { connectToDatabase } = require("./util/db")

const blogsRouter = require("./controllers/blogs")
const usersRouter = require("./controllers/users")
const authorsRouter = require("./controllers/authors")
const loginRouter = require("./controllers/login")
const logoutRouter = require("./controllers/logout")
const readinglistsRouter = require("./controllers/readinglists")

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  return response.status(400).send({ error: error.message })
}

app.use(express.json())

app.use("/api/blogs", blogsRouter)
app.use("/api/users", usersRouter)
app.use("/api/authors", authorsRouter)
app.use("/api/login", loginRouter)
app.use("/api/logout", logoutRouter)
app.use("/api/readinglists", readinglistsRouter)

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
