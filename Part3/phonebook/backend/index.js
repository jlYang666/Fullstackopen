const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {    
    return res.status(400).json({ error: err.message })  
  }

  next(err)
}

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


// original hardcoded data
// let persons = [
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

app.get('/api/persons', (request, response, next) => {
  Person.find().then(persons => {
    response.json(persons)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  //const person = persons.find(person => person.id === id)
  Person.findById(id).then(person => {
    response.json(person)
  }).catch(error => next(error))

  // if (person) {
  //   response.json(person)
  // } else {
  //   response.status(404).end()
  // }
})

app.post('/api/persons', async (request, response, next) => {
  const body = request.body
  //console.log(body)
  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }
  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  // for (let i = 1; i < persons.length; i++) {
  //   if (persons[i].name === body.name) {
  //     return response.status(400).json({ 
  //       error: 'name must be unique' 
  //     })
  //   }
  // }

  const found = await Person.findOne( {name: body.name} )
  if (found) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  // const person = {
  //   name: body.name,
  //   number: body.number,
  //   id: String(Math.floor(Math.random() * 100000)),
  // }
  const person = new Person({
    name : body.name,
    number : body.number,
  })

  // persons = persons.concat(person)
  // response.json(person)
  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
  // const id = request.params.id
  // persons = persons.filter(person => person.id !== id)
  // response.status(204).end()

  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', async (request, response) => {
  const time = new Date().toString()
  //console.log(time)
  const number = await Person.countDocuments()
  response.send(`Phonebook has info for ${number} people <br/><br/> ${time}`)
})

app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)