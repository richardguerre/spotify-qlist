import React from 'react';
import { Link } from 'react-router-dom';

export default function IndexPage(){
    return (
      <div className="IndexPage">
        <h1>Welcome qLister!</h1>
        <p>Please choose between creating a qList party or joining one!</p>
        <Link to={"http://localhost:8888"}><h2>Create</h2></Link>
        <Link to={"/queue"}>
          <h2>Join</h2>
        </Link>
      </div>
    )
}