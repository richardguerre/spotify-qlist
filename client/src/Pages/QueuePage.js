import React from 'react';

import Queue from '../Components/Queue';
import NowPlaying from '../Components/NowPlaying';
import AddToQueue from '../Components/AddToQueue';

export default function QueuePage() {

    return (
        <div className="QueuePage">
            <NowPlaying />
            <AddToQueue />
            <Queue />
            {/* QR code to be added */}
        </div>
    )
}