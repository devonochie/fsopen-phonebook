require('dotenv').config()
const mongoose = require('mongoose')


// Database Connection
const  url = process.env.MONGO_URI
mongoose.set('strictQuery', false)

console.log('Connecting to:', url)

// connect the database
mongoose.connect(url).then(() => {
  console.log('Connected to MongoDB')
}).catch(error => {
  console.log('Error connecting to MongoDB:', error)
})

// database Schema
const personSchema = new mongoose.Schema({
  name: { type: String,  required: true },
  number: {
    type: String,
    minLength: 8,
    required: [true, 'User Phone number is required'],
    validate: {
      validator: (v) => {
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
})

personSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject._v
  }
})

// database model
const Person = mongoose.model('Person', personSchema)


module.exports = Person