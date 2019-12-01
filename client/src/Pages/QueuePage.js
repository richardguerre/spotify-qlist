import React from 'react';
import { useStore } from 'react-hookstore';

import Queue from '../Components/Queue';
import NowPlaying from '../Components/NowPlaying';
import AddToQueue from '../Components/AddToQueue';

export default function QueuePage() {
  const [ appStore ] = useStore('appStore');

    const token = appStore.accessToken;

    // Test to check if token works
    // fetch('https://api.spotify.com/v1/me', {
    //   headers: {'Authorization':'Bearer ' + token}
    //     }).then((response) => response.json())
    //       .then((data) => console.log(data));

    return (
        <div className="QueuePage">
            <NowPlaying />
            <AddToQueue token={token} />
            <Queue queue={appStore.queue}/>
            {/* QR code to be added */}
        </div>
    )
}