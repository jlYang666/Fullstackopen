import Notification from './Notification'
import { useState } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const LoginForm = ( { setUser } ) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  const loginHandler = async(event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      setUsername('')
      setPassword('')
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))

      // login
      setNotificationType(
        'success'
      )
      setNotification(
        `${user.username} successfully log in`
      )
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
    catch(exception) {
      console.log(exception)
      setNotificationType(
        'fail'
      )
      setNotification(
        'wrong username or password'
      )
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  return (
    <div>
      <h2>log in to application</h2>
      <Notification notification = {notification} notificationType = {notificationType}></Notification>
      <form onSubmit={loginHandler}>
        <div>
                username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
                password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  setUser: PropTypes.func.isRequired,
}

export default LoginForm