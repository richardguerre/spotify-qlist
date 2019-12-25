import React, { useState } from 'react'

export default function NotFoundPage() {
  const [ search, setSearch ] = useState('');

  const handleSubmit = (e) =>{
    e.preventDefault();
    window.location.href = '/party/'+search;
  }

  return (
    <div>
      <h1>Party not found</h1>
      <form onSubmit={handleSubmit}>
        Go to <input type="text" placeholder="my party" onChange={(e) => setSearch(e.target.value)} required/>
      </form>
    </div>
  )
}