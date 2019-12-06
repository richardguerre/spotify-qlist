import React, { useEffect } from 'react';
import {Link} from 'react-router-dom';
import { useStore } from 'react-hookstore';
import Spotify from 'spotify-web-api-js';

export default function NavBar() {
    const [ appStore, setStore ] = useStore('appStore');
    const spotifyApi = new Spotify()

    useEffect( () => console.log(appStore), [appStore])

    //set userName
    useEffect( () => {
        if(appStore.accessToken){
            spotifyApi.setAccessToken(appStore.accessToken);
            spotifyApi.getMe()
            .then((data) => {
                setStore({...appStore, userName: data.display_name, userId: data.id})
            }, (err) => console.error("error: could not get user's info"))    
        }
    }, [])

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
