import React from 'react'
import { useStore } from 'react-hookstore';

export default function Song({song}) {

    const [appStore, setStore] = useStore('appStore');
    
    const handleUpVote = (e) => {
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
    }
    
    return (
        <div>
            <label>
    <button onClick={handleUpVote}>upVote {song.votes}</button>
                    {song.name} <span> </span>
                    {song.artists.join(', ')}
            </label>
        </div>
    )
}
