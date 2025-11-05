import { useEffect, useState } from 'react';
import personService from './service/persons';
import Person from './Person';
import Notification from './Notification';

export const Filter = ({ filter, onChange }) => {
  return (
    <div className="filter-section">
      <label className="filter-label">
        Filter shown with:
      </label>
      <input
        type="text"
        value={filter}
        onChange={onChange}
        className="filter-input"
        placeholder="Search contacts..."
      />
    </div>
  );
};

export const PersonForm = ({
  onSubmit,
  newName,
  newPhone,
  handleNameChange,
  handlePhoneChange
}) => {
  return (
    <form onSubmit={onSubmit} className="person-form">
      <div className="form-group">
        <label className="form-label">
          Name:
        </label>
        <input
          type="text"
          value={newName}
          onChange={handleNameChange}
          placeholder="Enter full name"
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">
          Number:
        </label>
        <input
          type="text"
          value={newPhone}
          onChange={handlePhoneChange}
          placeholder="Format: 0x-xxxxxx"
          className="form-input"
        />
      </div>
      
      <div className="form-actions">
        <button type="submit" className="submit-btn">
          Add Contact
        </button>
      </div>
    </form>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState(null);
  const [type, setType] = useState(null);

  useEffect(() => {
    console.log('Fetching data...');
    personService
      .getAll()
      .then(initialPerson => {
        console.log('Data loaded successfully');
        setPersons(initialPerson);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        showNotification('Failed to load contacts', 'error');
      });
  }, []);

  console.log(`Rendering ${persons.length} persons`);

  const addPhone = (nameObject) => {
    const isExist = persons.find(person =>
      person.name.toLowerCase() === newName.toLowerCase()
    );

    if (isExist) {
      if (window.confirm(
        `${isExist.name} is already in your phonebook. Would you like to update their number?`
      )) {
        const changedPerson = { ...isExist, number: newPhone };

        personService
          .update(isExist.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(n =>
              n.id === isExist.id ? returnedPerson : n
            ));
            showNotification(
              `✅ ${isExist.name}'s contact updated successfully`,
              'success'
            );
          })
          .catch(error => {
            showNotification(
              `❌ ${isExist.name} was removed from server`,
              'error'
            );
          });
      }
    } else {
      personService
        .create(nameObject)
        .then(newPerson => {
          setPersons(persons.concat(newPerson));
          showNotification(
            `✅ ${nameObject.name} added to phonebook`,
            'success'
          );
          setNewName('');
          setNewPhone('');
        })
        .catch(error => {
          const errorMsg = error.response?.data?.error || 'Operation failed';
          showNotification(`❌ ${errorMsg}`, 'error');
          console.error('Error details:', error.response?.data?.error);
        });
    }
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setNewPhone(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const showNotification = (msg, msgType, duration = 5000) => {
    setMessage(msg);
    setType(msgType);
    setTimeout(() => {
      setMessage(null);
    }, duration);
  };

  const toggleDeletePerson = (id) => {
    const person = persons.find(n => n.id === id);

    if (window.confirm(`Are you sure you want to delete ${person.name}?`)) {
      personService
        .doDelete(id)
        .then(() => {
          setPersons(persons.filter(n => n.id !== id));
          showNotification(
            `🗑️ ${person.name} removed from phonebook`,
            'success'
          );
        })
        .catch(error => {
          showNotification(
            `❌ Failed to delete ${person.name}`,
            'error'
          );
        });
    }
  };

  const namesToShow = filter
    ? persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons;

  return (
    <div className="phonebook-app">
      <header className="app-header">
        <h1 className="app-title">📱 Phonebook</h1>
        <p className="app-subtitle">Your personal contact manager</p>
      </header>

      <Notification message={message} type={type} />

      <section className="search-section">
        <Filter filter={filter} onChange={handleFilterChange} />
      </section>

      <section className="add-contact-section">
        <h2 className="section-title">Add New Contact</h2>
        <PersonForm
          onSubmit={(e) => {
            e.preventDefault();
            addPhone({ name: newName, number: newPhone });
          }}
          newName={newName}
          newPhone={newPhone}
          handleNameChange={handleNameChange}
          handlePhoneChange={handlePhoneChange}
        />
      </section>

      <section className="contacts-section">
        <h2 className="section-title">
          Contacts ({namesToShow.length})
        </h2>
        <Person
          namesToShow={namesToShow}
          toggleDelete={toggleDeletePerson}
        />
      </section>
    </div>
  );
};

export default App;
