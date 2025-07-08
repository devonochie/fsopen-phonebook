import { useEffect, useState } from 'react'
import personService from './service/persons'
import Person from './Person'
import Notification from './Notification'


export const Filter = ({ filter, onChange }) => {
  return (
    <div>
      filter shown with <input type='text' value={filter} onChange={onChange} />
    </div>
  )
}

export const PersonForm = ({ onSubmit, newName, newPhone, handleNameChange, handlePhoneChange }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input type='text' value={newName} onChange={handleNameChange} placeholder='Name' />
      </div>
      <div>
        number: <input type='text' value={newPhone} onChange={handlePhoneChange} placeholder='0x-xxxxxx'/>
      </div>
      <div>
        <button type="submit" >add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filter, setFilter] = useState('')
  const [message , setMessage] = useState(null)
  const [type, setType] = useState(null);

  useEffect(() => {
    console.log('effect')
    personService
    .getAll()
    .then(initialPerson => {
      console.log('Promised Fulfilled')
      setPersons(initialPerson)
    })
  }, [])

  console.log('render', persons.length, 'persons')
  
  const addPhone = (nameObject) => { 
    const isExist = persons.find(person => person.name === newName)
    if(isExist){
      if(window.confirm(`${isExist.name} is already added to phonebook, will you like to change the phone number`)){
        const changedPerson = {...isExist, number: newPhone }

        personService
        .update(isExist.id, changedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(n => n.id === isExist.id ? returnedPerson : n ))
          setMessage(
            `${isExist.name} details are updated successfully`, 
          )
          setType('success')
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setMessage(
            `${isExist.name} was already removed from server`, error
          )
          setType('error')
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
      }
    }else{
       personService
        .create(nameObject)
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
          setMessage(`Added ${nameObject.name} `)
          setType('success')
          setTimeout(() => {
            setMessage(null)
          },5000)
          setNewName('')
          setNewPhone('')     
        }).catch(error => {
          setMessage(error.response.data.error)
          setType('error')
          console.log(error.response.data.error)
          setTimeout(() => {
            setMessage(null)
          },8000)
        })
    }      
  }

  const handleNameChange = (e) => {
    setNewName(e.target.value)

  }

  const handlePhoneChange = (e) => {
    setNewPhone(e.target.value)
  
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
   
  }

  const namesToShow = filter ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())) : persons

  const toggleDeletePerson = id => {
    const person = persons.find(n => n.id === id)
   
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .doDelete(id)
        .then(returnedPerson => {
          console.log(returnedPerson)
          setPersons(persons.filter(n => n.id !== id))
        })
    }
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification  message={message} type={type}/>

      <Filter filter={filter} onChange={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm
        onSubmit={(e) => {
          e.preventDefault()
          addPhone({name: newName, number: newPhone})
        }}
        newName={newName}
        newPhone={newPhone}
        handleNameChange={handleNameChange}
        handlePhoneChange={handlePhoneChange}
      />

      <h3>Numbers</h3>
      
     <Person namesToShow={namesToShow} toggleDelete={toggleDeletePerson}/>
    </div>
  )
}

export default App
