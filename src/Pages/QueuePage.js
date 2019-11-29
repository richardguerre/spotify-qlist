import React, { useState } from 'react'

import Queue from '../Components/Queue';
import NowPlaying from '../Components/NowPlaying';

export default function QueuePage() {
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

    return (
        <div className="QueuePage">
            <NowPlaying />
            <input type="text" placeholder="Add a song!" />
            <button>Add</button>
            <Queue queue={fakeQueue}/>
            {/* QR code to be added */}
        </div>
    )
}