import React, { useState, useEffect } from 'react';
import { useStore } from 'react-hookstore';
import spotifyApi from 'spotify-web-api-js';


export default function AddToQueue() {
  //stores and states
  const [ userInfo ] = useStore('userInfo');
  const [ text, setText ] = useState('');
  const [ results, setResults ] = useState([]);
  //misc.
  const { socket } = userInfo;
  const spotify = new spotifyApi();
  spotify.setAccessToken(userInfo.accessToken);
  
  useEffect( () => {
    if(text !== ''){
      spotify.searchTracks(text, {limit : 5})
      .then( (res) => {
        setResults(res);
      }).catch( (err) => console.log(err))
    } else setResults([]);
    // eslint-disable-next-line
  }, [text]);
  
  const handleAdd = (e, track) => {
    e.preventDefault();
    setText('');
    setResults([]);
    socket.emit('add-song', { partyName : userInfo.partyName , song : { ...track, votes : 0, status : 'wannabe' }})
  }

  return (
    <div>
      <input type="text" placeholder="Add a song" onChange={(e) => setText(e.target.value)} value={text}/>
      {results.tracks && results.tracks.items && 
        <ul>
          {
            results.tracks.items.map((track) => 
            {
              return <li key={track.id} onClick={(e) => handleAdd(e, track)}>
                {track.name}
                <img style={{height : '40px'}} src={track.album.images[0].url} alt="album"/>
              </li>
            })
          }
        </ul>
      }
    </div>
  )
}