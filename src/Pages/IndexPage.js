import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function IndexPage() {
  const [ name, setName ] = useState('');
  
  return (
    <div className="IndexPage"> 
      <img src="/Static/logo.png" alt="qList logo"/>
      <form onSubmit={(e) => e.preventDefault()}>
        <input type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder="Party Name" required/>
      </form>
      <Link to={`/party/${name}`}><div className="join">Join</div></Link>
      <div className="seperator" />
      <a href={"http://qlist.herokuapp.com/api/login"}>Create*</a>
      <div className="bottom">*Requires a Spotify account</div>
    </div>
  )
}
