import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createStore, useStore } from 'react-hookstore';
import Spotify from 'spotify-web-api-js';
import io from 'socket.io-client';

import albumCover from '../static/albumCover'

createStore('devices', []);
createStore('playlist', {})

export default function CreatePage() {
	const [ appStore, setStore ] = useStore('appStore');
	const [ devices, setDevices ] = useStore('devices');
	const [ playlist, setPlaylist ] = useStore('playlist')
	const spotifyApi = new Spotify();
	spotifyApi.setAccessToken(appStore.accessToken);


	const fetchDevices = () => {
		spotifyApi.getMyDevices()
		.then(({devices}) => {
			setDevices([...devices]);
		});
	}
	
	const input_party = useRef(null);

	const handleSubmit = () => {
		const radio = document.getElementsByName("devices");
		let device_id;
		if (radio){
			for (let i = 0; i < radio.length; ++i){
				const device = radio[i];
				if (device.checked){
					device_id = device.value;
				}
			}
		}
		setStore({
			...appStore, 
			partyName : input_party.current.value, 
			deviceId : device_id 
		})

		// create playlist on user's spotify account
		spotifyApi.createPlaylist(appStore.userId, {
			"name" : "qList - " + input_party.current.value,
			"public" : true,
			"description" : "Playlist created from qList",
		})
		.then( (res) => {
			setPlaylist(res)
			spotifyApi.uploadCustomPlaylistCoverImage(res.id, albumCover)
				.then( (err, res) => err?console.log(err):console.log(res) ) // still need to find callbacks
		})

		const party = {
			partyName : input_party.current.value,
			accessToken : appStore.accessToken
		}
		const socket = io('http://localhost:8888/');
		socket.emit('create-party', party);
	}
	
	return (
		<>
			<label>
				{"Party Name: "}
				<input type="text" ref={input_party} name="name" placeholder="I got friends" value={appStore.partyName}/>
			</label>
			<p>Try opening the spotify web player</p>
			<a href="http://open.spotify.com/" target="_blank">Web Player</a>
			<p>or open spotify on one of your devices</p>
			<button name="Fetch devices" onClick={fetchDevices}>Fetch Devices</button>
			{devices && <Devices /> }
			<Link to={`/queue/${appStore.partyName}`}><input type="submit" value="Submit" onClick={handleSubmit}/></Link>
		</>
	)
}

function Devices()
{
	const [ devices ] = useStore('devices');
	const [ appStore, setStore ] = useStore('appStore');
	
	return (
		<>
			<fieldset>
				<legend>Select Device</legend>
				<ul>
					{devices.map((device) => {
						return (
							<li key={device.id}>
								<input type="radio" id={device.name} name="devices" value={device.id}></input>
								<label htmlFor={device.name}>{device.name}</label>
							</li>
						)
					})}
				</ul>
			</fieldset>
		</>
	);
}