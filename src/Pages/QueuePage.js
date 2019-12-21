import React from 'react';
import {useParams} from 'react-router-dom';
import { useStore } from 'react-hookstore';
import io from 'socket.io-client';

import Queue from '../Components/Queue';
import NowPlaying from '../Components/NowPlaying';
import AddToQueue from '../Components/AddToQueue';

export default function QueuePage() {
    const socket = io('http://localhost:8888/');
    const [appStore, setStore] = useStore('appStore');
    const {partyName} = useParams();

    socket.emit('join-party', partyName);

    socket.on('join-party', (data) => 
    {
        if(!data.status){
            // setParty(data)
        } else {
            //TODO
        }
    })
    
    socket.on('update', (data) =>
    {
        // setParty(data);
    })

    return (
        <div className="QueuePage">
            <NowPlaying />
            <AddToQueue />
            <Queue />
            {/* QR code to be added */}
        </div>
    )
}