import React, { useEffect } from 'react';
import { useStore } from 'react-hookstore';
import Spotify from 'spotify-web-api-js';

export default function NowPlaying() {
    const [ appStore, setStore] = useStore('appStore');

    const spotifyApi = new Spotify();
    spotifyApi.setAccessToken(appStore.accessToken);

    const playTrack = () => {
        spotifyApi.transferMyPlayback([appStore.deviceId])
        .then( (err, res) => err ? console.log(err) : console.log(res))
        spotifyApi.play()
        .then( (err, res) => err ? console.log(err) : console.log(res))
    }
    
    useEffect( () => {
        setStore({
            ...appStore, 
            nowPlaying : { 
                ...appStore.queue[0], 
                image: appStore.hasQueue && appStore.queue[0].images[0], 
                isPlaying : true,
                artist : appStore.hasQueue && appStore.queue[0].artists
            }
        })
    }, [appStore.queue])

    return (
        <div className="NowPlaying">
            {appStore.hasQueue ?
            <div>
                <img src={appStore.nowPlaying.image.toString()} alt="image not showing"/>
                <div>
                    {appStore.nowPlaying.name}
                    <br/>
                    {" by "}{appStore.nowPlaying.artists}
                </div>
                <button onClick={() => playTrack()}>Play</button>
                <a href={appStore.nowPlaying.playUrl} target="_blank"><button>Go to Spotify</button></a>
            </div>    
            : <div></div>}
        </div>
    )
}
