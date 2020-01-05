import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  const [ search, setSearch ] = useState('');

  const handleSubmit = (e) =>{
    e.preventDefault();
    window.location.href = '/#/party/'+search;
  }

  return (
    <div className="NotFoundPage">
      <Link to={'/'}><img src="/Static/logo.png" alt="qList logo"/></Link>
      <h1>Party not found</h1>
      <p>Please make sure you match case (e.g. qlist ≠ qList). If this doesn’t work, please ask the creator to re-create a party.</p>
      <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Party Name" onChange={(e) => setSearch(e.target.value)} required/>
      <Link to={`/party/${search}`}><div className="join">Join</div></Link>
      </form>
    </div>
  )
}