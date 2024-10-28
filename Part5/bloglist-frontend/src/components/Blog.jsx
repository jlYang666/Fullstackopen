import {useState} from 'react'

const Blog = ({ blog, updateBlog, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [view, setView] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const like = async () => {
    blog.likes = blog.likes + 1
    setLikes(blog.likes)
    await updateBlog(blog.id, {
      likes: blog.likes,
    })
  }

  const remove = async () => {
    if (confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await removeBlog(blog.id)
    }
  }

  if (view) {
    return (
      <div style={blogStyle}>
      <div>
          {blog.title} <button onClick={() => setView(!view)}>{view ? 'hide' : 'view'}</button><br />
          {blog.url}<br />
          {likes} <button onClick={() => like()}>like</button> <br /> 
          {blog.author}<br />
          <button onClick={() => remove()}>remove</button>
        </div>
      </div>
    )
  } else {
    return (
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author} <button onClick={() => setView(!view)}>{view ? 'hide' : 'view'}</button>
        </div>
      </div>
    )
  }
} 
export default Blog