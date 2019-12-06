import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from 'react-hookstore';

export default function IndexPage(){
  const [ appStore ] = useStore('appStore')
  
  return (
    <div className="IndexPage">
      <h1>Welcome qLister!</h1>
      <p>Please choose between creating a qList party or joining one!</p>
      { appStore.isLoggedIn 
        ? ( appStore.partyName ? <Link to={'/create'}><h2>Change</h2></Link> : <Link to={'/create'}><h2>Create</h2></Link>) 
        : <a href="http://localhost:8888/login"><h2>Login</h2></a>}
      <Link to={`/queue/${appStore.partyName}`}><h2>Join</h2></Link>
    </div>
  )
}