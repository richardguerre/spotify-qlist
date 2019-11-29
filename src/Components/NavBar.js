import React from 'react';
import {Link} from 'react-router-dom';

export default function NavBar() {
    const hasQueue = true;


    return (
        <nav>
            <Link href="/">qListLogo</Link>
            {hasQueue?<h2>Fake Party</h2>:<div></div>}
            <a href="http://localhost:8888/">Login</a>
        </nav>
    )
}
