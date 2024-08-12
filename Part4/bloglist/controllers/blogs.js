const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { tokenExtractor, userExtractor } = require("../utils/middleware");


// const getTokenFrom = request => {
//     const authorization = request.get('authorization')
//     if (authorization && authorization.startsWith('Bearer ')) {
//       return authorization.replace('Bearer ', '')
//     }
//     return null
// }

blogsRouter.get('/', async (request, response) => {
    
    const blogs = await Blog.find({}).populate("user", {
        username: 1,
        name: 1,
        id: 1
      })
    response.json(blogs)
    // Blog
    //     .find({})
    //     .then(blogs => {
    //         response.json(blogs)
    //     })
})
  
blogsRouter.post('/', tokenExtractor, userExtractor, async (request, response, next) => {
    
    if (!request.token) return response.status(401).json({ error: "token missing" })
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) return response.status(401).json({ error: "token invalid" })

    const blog = new Blog(request.body)

    // const decodedToken = jwt.verify(request.token, process.env.SECRET)
    // if (!decodedToken.id) {
    //   return response.status(401).json({ error: 'token invalid' })
    // }
    const user = request.user

    blog.user = user._id
    
    const savedBlog = await blog.save()
    //console.log('here2')
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
    
    // blog
    //     .save()
    //     .then(result => {
    //         response.status(201).json(result)
    //     })
})

blogsRouter.put('/:id',  async (request, response, next) => {


    const body = request.body

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    }
  
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true })

    if (updatedBlog) {
        response.json(updatedBlog)
    }

    response.status(404).end()
})

blogsRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response, next) => {
    // const id = request.params.id
    // persons = persons.filter(person => person.id !== id)
    // response.status(204).end()
    if (!request.token) return response.status(401).json({ error: "token missing" })
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) return response.status(401).json({ error: "token invalid" })

    const user = request.user

    let blog = await Blog.findById(request.params.id);

    if (!blog) {
        return response.status(404).json({ error: "blog not found" });
    
    }
    if (blog.user.toString() !== user.id.toString()) {
        return response.status(401).json({ error: "user not authorized" });
    }

    blog = await Blog.findByIdAndDelete(request.params.id)
    //console.log(blog)
    response.status(204).end()
})

module.exports = blogsRouter