import Blog from './Blog'
import Notification from './Notification'
import blogService from '../services/blogs'
import Togglable from './Toggleable'
import { useState, useEffect, useRef } from 'react'

const Blogs = ({ setUser, username }) => {

  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const blogsFormRef = useRef()

  const logoutHandler = async(event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedInUser')
    setNotificationType(
      'success'
    )
    setNotification(
      `${username} successfully log out`
    )
    setTimeout(() => {
      setNotification(null)
    }, 3000)
    setUser(null)
  }

  const createHandler = async(event) => {
    event.preventDefault()
    blogsFormRef.current.toggleVisibility()

    const blogObject = {
      autho: author,
      title: title,
      url: url
    }

    const returnedBlog = await blogService.createBlog(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    const tempTitle = title
    const tempAuthor = author
    setTitle('')
    setAuthor('')
    setUrl('')

    setNotificationType(
      'success'
    )
    setNotification(
      `a new blog ${tempTitle} by ${tempAuthor} added`
    )
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs( blogs )
    })
  }, [blogs])

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification = {notification} notificationType = {notificationType}></Notification>
      <p>{username} logged in <button onClick={logoutHandler}>logout</button></p>

      <Togglable buttonLabel='new blog' ref={blogsFormRef}>
        <h2>create new</h2>
        <form onSubmit={createHandler}>
          <div>
                        title
            <input
              type="text"
              value={title}
              name="title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
                        author
            <input
              type="text"
              value={author}
              name="author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
                        url
            <input
              type="text"
              value={url}
              name="url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <button type="submit">create</button>
        </form>
      </Togglable>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={blogService.updateBlog} removeBlog={blogService.deleteBlog}/>
      )}
    </div>
  )
}

export default Blogs
