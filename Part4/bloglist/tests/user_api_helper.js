const User = require('../models/user')

const initialUsers = [
    {
        name: "User1",
        username: "User1",
        password: "User1pwd",
      },
      {
        name: "User2",
        username: "User2",
        password: "User2pwd",
      },
      {
        name: "User3",
        username: "User3",
        password: "User3pwd",
      },
      {
        name: "User4",
        username: "User4",
        password: "User4pwd",
      },
]

const usersInDb = async () => {
    const users = await User.find({})
    return users
}

module.exports = {
    initialUsers,
    usersInDb
}