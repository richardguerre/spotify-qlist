import React, { useState } from 'react';
import Queue from './Queue.js'
import NowPlaying from './NowPlaying.js'
import axios from 'axios'

function App() {
  const [queue, setQueue] = useState([
    {
      id: 1,
      name: "Despacito",
      author: "Luis Fonsi",
      playing: false
    },
    {
      id: 2,
      name: "Despacito2",
      author: "Luis Fonsi",
      playing: false
    }
  ]);

  // componentDidMount() {
  //   axios.get('https://api.spotify.com/v1/search')
  //     .then(res => {
  //       const songs = res.data;
  //     })
  // }

  return (
    <>
      <NowPlaying />
      <input type="text" placeholder="Add your own song!" />
      <button>Add</button>
      <Queue queue={queue} />
      {/* QR code to be added */}
    </>
  )
}

export default App;
