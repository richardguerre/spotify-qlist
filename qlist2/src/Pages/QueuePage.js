//import libraries
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from 'react-hookstore';
//import components
import AddToQueue from '../Components/AddToQueue'
//import misc.

export default function QueuePage() {
  //stores and states
  const [ userInfo, setUser ] = useStore('userInfo');
  const { socket } = userInfo;
  const [ queue, setQueue ] = useStore('queue');
  //Misc.
  const { partyName } = useParams();

  useEffect( () => {
    socket.emit('join-party', partyName)
    socket.on('join-party', (response) => { //party may not exist
      console.log(response);
      if(response === 'party not found'){
        window.location.href = '/not-found';
      } else {
        setUser({
          ...userInfo,
          accessToken : response.accessToken,
          partyName : partyName,
        })
        setQueue(response.party);
      }
    })
    socket.on('update', (queue) => {
      setQueue(queue);
    })
    // eslint-disable-next-line
  }, [socket, partyName, setQueue, setUser])

  const handleVote = (song) =>{
    socket.emit('vote', { partyName : userInfo.partyName, song : song})
  }

  return (
    <>
      <h1>{userInfo.partyName?userInfo.partyName:'Loading...'}</h1>
      {userInfo.partyName?<AddToQueue />:''}
      <ul>
        {(queue)?queue.map( (song) => {
          return <li key={song.name}>{song.name+' '+song.votes+' '}<img style={{height: '40px'}} src={song.album.images[0].url}/><button onClick={() => handleVote(song)}>^</button></li>
        })
        :<li>loading songs...</li>}
      </ul>
			{userInfo.partyName && 
        <>
          <h5>Share</h5>
          <img src={`https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=http://localhost:3000/party/${partyName}&choe=UTF-8`} alt="qList QR code"/>
        </>}
    </>
  )
}