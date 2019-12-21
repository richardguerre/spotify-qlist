import React from 'react';
import { useStore } from 'react-hookstore';
import Spotify from 'spotify-web-api-js';
import io from 'socket.io-client'

export default function Song({song}) {

    const socket = io('http://localhost:8888');
    const [appStore, setStore] = useStore('appStore');
    const [playlist, setPlaylist] = useStore('playlist');
    const spotifyApi = new Spotify();
    
    const handleUpVote = (song) => {
        setStore({
            ...appStore, 
            queue : [ 
                ...appStore.queue,
                ...appStore.queue.filter((queueItem) => {
                    if(queueItem.id === song.id)
                        queueItem.votes = song.votes+1
                })
            ]
        })

        
        // let currentIndex = appStore.queue.indexOf(song);
        // let oldIndex = currentIndex;
        // let prevSong = appStore.queue[currentIndex - 1];
        
        // while (currentIndex - 1 > 0 && prevSong.votes < song.votes)
        // {
        //     prevSong = appStore.queue[currentIndex - 1];
        //     --currentIndex;
        // }
        
        setStore({ 
            ...appStore, 
            queue : [
                ...appStore.queue.sort( (song1, song2) => {
                    if(song1.votes < song2.votes)
                        return 1;
                    else if(song1.votes === song2.votes)
                        return 0;
                    else 
                        return -1;
                })
            ]
        })

        socket.emit('up-vote', song.id);

    }

    const handleReorder = () => {
        spotifyApi.reorderTracksInPlaylist(playlist.id, 1, 0)
            .then( (err, res) => err?console.log(err):console.log(res))
    }
    
    return (
        <div>
            <label>
                <button onClick={() => handleUpVote(song)}>upVote {song.votes}</button>
                {song.name}{' by '}{song.artists.join(', ')}
                <button onClick={handleReorder}>Reorder</button>
            </label>
        </div>
    )
}
