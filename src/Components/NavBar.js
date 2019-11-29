import React from 'react';
import {Link} from 'react-router-dom';

export default function NavBar() {
    const hasQueue = false;
    const partyName = 'Fake Party'
    const loggedIn = false;

    return (
        <nav>
            <Link to="/">qListLogo</Link>
            {hasQueue ?
                <h2>{partyName}</h2> :
                <div></div>}
            {loggedIn ?
                <div></div> :
                <a href="http://localhost:3000/login">Login</a>}
        </nav>
    )
}
