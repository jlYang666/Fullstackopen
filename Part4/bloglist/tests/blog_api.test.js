const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./blog_api_helper')
const app = require('../app')
const jwt = require('jsonwebtoken')
const { DESTRUCTION } = require('node:dns')
const { initialUsers } = require('./user_api_helper')

const api = supertest(app)
let token = '' // token for authorization

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({});

    const testUser = {...initialUsers[0]}

    await api.post('/api/users').send(testUser)
    const response = await api.get('/api/users') // all users (only one in the db)
    const users = response.body

    const userForToken = {
      username: users[0].username,
      id: users[0].id
    }

    token = jwt.sign(userForToken, process.env.SECRET)
    //console.log(token)
    // get user id
    for (let blog of helper.initialBlogs) {
        let blogObject = new Blog({ ...blog, user: users[0].id })
        await blogObject.save()
    }
})

describe('test GET', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')
        
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
  
  test("blogs have property 'id'", async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    for (const blog of blogs) {
      assert(blog.id)
    }
  })
})

describe('test post', () => {
  test('a valid blog could be added', async () => {
    const newBlog = {
      title: "test",
      author: "test",
      url: "https://reactpatterns.com/"
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('authorization',`Bearer ${token}`)
      .expect(201)
    
    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)
  
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
  
    assert(titles.includes('test'))
  })

  test('missing like property will default to the value 0', async () => {
    const newBlog = {
      title: "test",
      author: "test",
      url: "https://reactpatterns.com/"
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('authorization',`Bearer ${token}`)
    assert.strictEqual(response.body.likes, 0)
  })

  test('missing title would get 400 Bad request', async () => {
    const newBlog = {
      author: "test",
      url: "https://reactpatterns.com/"
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('authorization',`Bearer ${token}`)
      .expect(400)
  })

  test('missing url would get 400 Bad request', async () => {
    const newBlog = {
      title: "test",
      author: "test",
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('authorization',`Bearer ${token}`)
      .expect(400)
  })

  test('token is not provided would fail with status code 401', async () => {
    const newBlog = {
      title: "test",
      author: "test",
      url: "https://reactpatterns.com/"
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })
})

describe('test DELETE', () => {
  test('delete existing blog, status code 204', async () => {

    await api
      .delete('/api/blogs/5a422a851b54a676234d17f7')
      .set('authorization',`Bearer ${token}`)
      .expect(204)

  })

  test('delete invalid id, get status code 400', async () => {

    await api
      .delete('/api/blogs/invalidid')
      .set('authorization',`Bearer ${token}`)
      .expect(400)
  })

  test('delete non-existent blog, get status code 404', async () => {

    await api
      .delete('/api/blogs/5a422a851b54a676234d17a7')
      .set('authorization',`Bearer ${token}`)
      .expect(404)
  })

  test('delete without valid token, get status code 401', async () => {

    await api
      .delete('/api/blogs/5a422a851b54a676234d17f7')
      .expect(401)
  })

})


describe('test PUT', () => {
  test('update get correct, status code 200', async () => {

    const updatedBlog =     {
        title: "updated title",
        author: "updated author",
        url: "updated url",
        likes: 8,
    }
    const response = await api.put('/api/blogs/5a422a851b54a676234d17f7').send(updatedBlog).expect(200)
    assert.strictEqual(response.body.likes, updatedBlog.likes)
    assert.strictEqual(response.body.title, updatedBlog.title)
    assert.strictEqual(response.body.url, updatedBlog.url)
    assert.strictEqual(response.body.author, updatedBlog.author)
  })

  test('partly updated, get correctly updated', async () => {

    const updatedBlog =     {
        url: "updated url",
        likes: 8,
    }

    const response = await api.put('/api/blogs/5a422a851b54a676234d17f7').send(updatedBlog).expect(200)
    assert.strictEqual(response.body.title, "React patterns")
    assert.strictEqual(response.body.author, "Michael Chan")
    assert.strictEqual(response.body.url, updatedBlog.url)
    assert.strictEqual(response.body.likes, updatedBlog.likes)
  })

  test('update invalid id, get status code 400', async () => {

    const updatedBlog =     {
        url: "updated url",
        likes: 8,
    }

    const response = await api.put('/api/blogs/invalidid').send(updatedBlog).expect(400)
  })

  test('update non-existent blog, get status code 404', async () => {

    const updatedBlog =     {
        url: "updated url",
        likes: 8,
    }

    const response = await api.put('/api/blogs/5a422a851b54a676234d17a7').send(updatedBlog).expect(404)
  })

})

after(async () => {
  await mongoose.connection.close()
})