import React from 'react';
import { Link } from 'react-router-dom';

export default function IndexPage(){

    let url = window.location.toString();
    let accessTokenIdx = url.indexOf('access_token');
    let token = url.substring(accessTokenIdx);
    token = token.replace('access_token=', '');

    return (
      <div className="IndexPage">
        <h1>Welcome qLister!</h1>
        <p>Please choose between creating a qList party or joining one!</p>
        <a href={"http://localhost:8888/login"}><h2>Create</h2></a>
        <Link to={`/queue/?access_token=${token}`}>
          <h2>Join</h2>
        </Link>
      </div>
    )
}