import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function IndexPage() {
  const [ name, setName ] = useState('');

  /*
    Join component should be the only thing in the middle 
    Create link should be in a corner, most users will not be creating but joining parties
    Good example of this layout can be found on http://kahoot.it
  */
  
  return (
    <div>
      <h1>qList</h1>
      <br/><br/><br/><br/>
      <a href="http://localhost:8080/api/login">Create</a>
      <br/><br/>
      <input type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder="Party Name"/>
      <br/>
      <Link to={`/party/${name}`}>Join</Link>
    </div>
  )
}
