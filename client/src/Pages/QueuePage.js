import React, { useState } from 'react'

import Queue from '../Components/Queue';
import NowPlaying from '../Components/NowPlaying';

export default function QueuePage() {

    let url = window.location.toString();
    let accessTokenIdx = url.indexOf('access_token');
    let token = url.substring(accessTokenIdx);
    token = token.replace('access_token=', '');

    // Test to check if token works
    fetch('https://api.spotify.com/v1/me', {
      headers: {'Authorization':'Bearer ' + token}
        }).then((response) => response.json())
          .then((data) => console.log(data));

    const [fakeQueue, setFakeQueue] = useState([
        {
          id: 1,
          name: "Despacito",
          author: "Luis Fonsi",
          playing: false,
          votes: 0
        },
        {
          id: 2,
          name: "Despacito2",
          author: "Luis Fonsi",
          playing: false,
          votes: 0
        }
    ]);

    function handleChange(e)
    {
      if (e.target.value !== '')
      {

      }
    }

    return (
        <div className="QueuePage">
            <NowPlaying />
            <input type="text" onChange={handleChange} placeholder="Add a song!" />
            <button>Add</button>
            <Queue queue={fakeQueue}/>
            {/* QR code to be added */}
        </div>
    )
}