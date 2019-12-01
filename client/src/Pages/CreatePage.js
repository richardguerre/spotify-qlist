import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createStore, useStore } from 'react-hookstore';
import Spotify from 'spotify-web-api-js';

createStore('devices', []);

export default function CreatePage() {
    const [ appStore, setStore ] = useStore('appStore');
    const [ devices, setDevices ] = useStore('devices');
    const spotifyApi = new Spotify();
    spotifyApi.setAccessToken(appStore.accessToken);

    const fetchDevices = () => {
        spotifyApi.getMyDevices()
        .then((response) => {
            setDevices([...response.devices]);
        });
    }
    
    const input_party = useRef(null);

    const handleSubmit = () => {
        setStore({...appStore, partyName : input_party.current.value })
    }
    
    return (
        <>
            <label>
                {"Party Name: "}
                <input type="text" ref={input_party} name="name" placeholder="I got friends"/>
            </label>
            <p>Try opening the spotify web player</p>
            <a href="http://open.spotify.com/" target="_blank">Web Player</a>
            <p>or open spotify on one of your devices</p>
            <button name="Fetch devices" onClick={fetchDevices}>Fetch Devices</button>
            {devices && <Devices /> }
            {/* {console.log(devices)} */}
            <Link to={`/queue/${appStore.partyName}`}><input type="submit" value="Submit" onClick={handleSubmit}/></Link>
        </>
    )
}

function Devices()
{
    const [ devices ] = useStore('devices');
    const [ appStore, setStore ] = useStore('appStore');
    
    const handleSelectDevice = (device_id) => {
        setStore({...appStore, deviceId : device_id});
    };

    return (
        <>
            <ul>
                {devices.map((device) => {
                    return <li key={device.id} onClick={() => handleSelectDevice(device.id)}>{device.name}</li>
                })}
            </ul>
        </>
    );
}