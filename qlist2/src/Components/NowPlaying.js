import React, { useState, useEffect} from 'react'
import { useStore } from 'react-hookstore'

const NowPlaying = () => {
  const [ userInfo ] = useStore('userInfo')
  const { socket } = userInfo;
  const [ position, setPosition ] = useState(0)
  const [ track, setTrack ] = useState(undefined)

  if(track){
    setInterval( () => {
      setPosition(position+1);
    }, 1000)
  }

  useEffect(() => {
    socket.emit('now-playing', userInfo.partyName)
    console.log('tick');
    socket.on('now-playing', res => {
      setTrack(res.body.item);
      let sec = Math.floor(res.body.progress_ms / 1000);
      setPosition(sec);
    }); 
  }, [socket])
   
  return (
    <>
      {(track!==undefined)?(<div>
        <img style={{height: '100px'}} src={track.album.images[0].url} alt="Album cover"/>
        {track.name} {track.artists.map( a => a.name).join(',')}
        {Math.floor(position / 60)} : {position % 60}
      </div>):''}
    </>
  )
}

export default NowPlaying;