import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Blogs from './components/Blogs'
import Togglable from './components/Toggleable'

import LoginForm  from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'



const App = () => {

  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = <LoginForm setUser={setUser}></LoginForm>
  const blogsView = <Blogs setUser={setUser} username={user ? user.name : ''}></Blogs>

  return (
    <div>
      {user === null ? loginForm : blogsView }
    </div>
  )
}

export default App