import { useState, useEffect } from 'react'
//import axios from 'axios'
import personService from './services/persons'
import './index.css'


const Notification = ( {message, className} ) => {
  if (message === null) {
    return null
  }

  return (
    <div className={className}>
      {message}
    </div>
  )
}

const Filter = ( {filter, handler} ) => {
  return (
    <div>
        filter shown with <input 
        value = {filter}
        onChange = {handler}
    />
    </div>
  )
}

const PersonForm = ( {newName, newNumber, handleNameChange, handleNumberChange, handleAddPerson} ) => {
  return (
    <form onSubmit = {handleAddPerson}>
      <div>
        name: <input 
          value = {newName}
          onChange = {handleNameChange}
        />
      </div>
      <div>
        number:<input 
          value = {newNumber}
          onChange = {handleNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ( {persons, handler} ) => {
  return (
    persons.map(person => <div key={person.id}> {person.name} {person.number} <button onClick={() => handler(person.id, person.name)}>delete</button></div>)
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  const handleAddPerson = (event) => {
    event.preventDefault()
    if (newName === '' || newNumber === '') {
      alert(`empty name or number`) 
      return
    }
    const personObject = {
      name: newName,
      number: newNumber
    }
    //console.log('button clicked', newName)
    for(let i = 0; i < persons.length; i++) {
      if (persons[i].name === newName) {
        // alert(`${newName} is already added to phonebook`)
        // return
        // console.log(persons[i].id)
        if (confirm(`${newName} is already added to phonenumber, replace the old number with new one?`)) {
          personService
            .update(persons[i].id, personObject)
            .then(response => {
                setPersons(persons.map(p => p.id !== persons[i].id ? p : response.data))
                setNewName('')
                setNewNumber('')
              })
          setNotificationType(
            'success'
          )
          setNotification(
            `${newName}'s number is changed`
          )
          setTimeout(() => {
            setNotification(null)
          }, 3000)
        }
        return
      }
    }

    // setPersons(persons.concat(personObject))
    // setNewName('')
    // setNewNumber('')

    personService
      .create(personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
        setNotificationType(
          'success'
        )
        setNotification(
          `Added ${newName}`
        )
        setTimeout(() => {
          setNotification(null)
        }, 3000)
      })
  }

  const handleNameChange = (event) => {
    //console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    //console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  useEffect(() => {
    //console.log('effect')
    personService
      .getAll()
      .then(response => {
        //console.log('promise fulfilled')
        setPersons(response.data)
        })
  }, [])

  const handleDelete = (id, name) => {
    if (confirm(`Delete ${name} ?`)) {
        //console.log(id)
        personService
        .deletePerson(id)
        .then(response => {
          // refresh the page
          setPersons(persons.filter(p => p.id !== id))
          setNotificationType(
            'success'
          )
          setNotification(
            `${name} is successfully deleted`
          )
          setTimeout(() => {
            setNotification(null)
          }, 3000)
        })
        .catch(error => {
          console.log('fail')
          setNotificationType(
            'fail'
          )
          setNotification(
            `Information of ${name} has already been removed from server`
          )
          setTimeout(() => {
            setNotification(null)
          }, 3000)
        })
    }
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message = {notification} className = {notificationType}></Notification>
      <Filter filter = {newFilter} handler = {handleFilterChange}></Filter>

      <h3>add a new</h3>
      <PersonForm newName = {newName} newNumber = {newNumber} handleNameChange = {handleNameChange} handleNumberChange = {handleNumberChange} handleAddPerson = {handleAddPerson}></PersonForm>
      <h3>Numbers</h3>
      <Persons persons = {personsToShow} handler = {handleDelete}></Persons>
    </div>
  )
}

export default App