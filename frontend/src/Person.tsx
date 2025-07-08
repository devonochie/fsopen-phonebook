import React from 'react'

export const Person = ({namesToShow, toggleDelete}) => {
  return (
    <ul>
    {namesToShow.map((person, i) => (
      <li key={i}>
        {person.name} - {person.number}  <button onClick={() => toggleDelete(person.id)}>delete</button>
      </li>
    ))}
  </ul>
  )
}

export default Person