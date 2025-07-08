const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

if(process.argv < 3){
  console.log('please include mongo password <passwo>')
  process.exit(1)
}

const url = `mongodb+srv://william:${password}@cluster0.jm5rb.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number : String
})

const Person = mongoose.model('Person', personSchema)


const person = new Person({
  name: name,
  number: number
})

person.save().then(result => {
  console.log('person save', result)

})

Person
  .find({}).then(result => {
    result.forEach(persons => {
      console.log(persons)
    })
    mongoose.connection.close()
  })
