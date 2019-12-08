import React from 'react';
import io from 'socket.io-client';

import Queue from '../Components/Queue';
import NowPlaying from '../Components/NowPlaying';
import AddToQueue from '../Components/AddToQueue';


export default function QueuePage() {
const socket = io('http://localhost:8888/');

    return (
        <div className="QueuePage">
            <NowPlaying />
            <AddToQueue />
            <Queue />
            {/* QR code to be added */}
        </div>
    )
}