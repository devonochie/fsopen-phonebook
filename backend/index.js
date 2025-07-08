const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')
const cors = require('cors')
const date = Date('en-US')

app.use(express.static('dist'))
app.use(express.json())

// morgan generates token
morgan.token('body', (req) => JSON.stringify(req.body))
// middleware for logging
app.use(morgan(':method :url :status :response-time ms - :body '))

app.use(cors())

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
  })
})

// get persons from database
app.get('/api/persons', (req, res) => {
  Person.find({}).then(result => {
    res.json(result)
  })
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  Person.findOne({ name: person.name }).then(isExist => {
    if (isExist) {
      return res.json({ message: `${isExist.name} is already added to phonebook, would you like to change the phone number` })
    }

    person.save().then(result => {
      console.log(result)
      console.log(`added ${person.name} number ${person.number} to phonebook`)
      res.json(person)
    }).catch(err => next(err))
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(person => {
      if (person) {
        res.json({ person, message: 'This person was deleted successfully' })
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(err => next(err))
})

const requestLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path:', req.path)
  console.log('Body:', req.body)
  console.log('---')
  next()
}

app.use(requestLogger)

const unKnownEndPoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unKnownEndPoint)

// error handling for middleware
const errorHandler = (err, req, res, next) => {
  console.log(err.message)

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'Malformatted id' })
  }else if(err.name === 'ValidationError'){
    return res.status(400).json({ error: err.message })
  }

  next(err)
}

app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`)
})
