import React from 'react';
import {Link} from 'react-router-dom';
import { useStore } from 'react-hookstore';

export default function NavBar() {
    const [ appStore ] = useStore('appStore')

    return (
        <nav>
            <Link to="/">qListLogo</Link>
            <h2>{ appStore.partyName}</h2>
            <div>
                { appStore.userName || <a href="http://localhost:8888/login">Login</a>}
            </div>
        </nav>
    )
}
