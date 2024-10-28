const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get("/", async (request, response) => {
    // populate: Mongoose's join query
    const users = await User.find({}).populate("blogs", {
      url: 1,
      title: 1,
      author: 1,
    })
  
    response.json(users);
})

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  const saltRounds = 10

  if (!password) {
    return response.status(400).json({
        error: "password required",
      })
  }

  if (password.length < 3) {
    return response.status(400).json({
      error: "password is shorter than the minimum allowed length (3)",
    })
  }

  const passwordHash = await bcrypt.hash(password, saltRounds)

  const isExist = await User.findOne({ username });
  if (isExist) {
    return response.status(400).json({
      error: "username must be unique",
    })
  }

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter