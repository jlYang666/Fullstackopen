const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const helper = require('./user_api_helper')
const app = require('../app')
const { DESTRUCTION } = require('node:dns')

const api = supertest(app)


beforeEach(async () => {
    await User.deleteMany({})
    for (let user of helper.initialUsers) {
        let userObject = new User(user)
        await userObject.save()
    }
})

describe('test GET', () => {
  test('users are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('all users are returned', async () => {
      const response = await api.get('/api/users')
        
      assert.strictEqual(response.body.length, helper.initialUsers.length)
  })
})

describe('test post', () => {
  test('a valid user could be added', async () => {
    const validUser = {
      username: "test",
      name: "test",
      password: "test"
    }

    await api
      .post('/api/users')
      .send(validUser)
      .expect(201)
    
    const response = await api.get('/api/users')

    console.log(response.body)

    assert.strictEqual(response.body.length, helper.initialUsers.length + 1)

  })

  test('missing username would fail with status code 400', async () => {
    const invalidUser = {
        name: "test",
        password: "test"
      }
  
    await api
        .post('/api/users')
        .send(invalidUser)
        .expect(400)
    const response = await api.get('/api/users')
    console.log(response.body)
    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })

  test('missing password would fail with status code 400', async () => {
    const invalidUser = {
        username: "test",
        name: "test",
      }
  
      await api
        .post('/api/users')
        .send(invalidUser)
        .expect(400)
    const response = await api.get('/api/users')
    console.log(response.body)
    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })

  test('password shorter than 3 charcters would fail with status code 400', async () => {
    const invalidUser = {
      username: "test",
      name: "test",
      password: "12"
    }

    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })

  test('username shorter than 3 charcters would fail with status code 400', async () => {
    const invalidUser = {
      username: "te",
      name: "test",
      password: "test"
    }

    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })

})

after(async () => {
  await mongoose.connection.close()
})