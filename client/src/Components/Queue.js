import React from 'react';
import { useStore } from 'react-hookstore';

import Song from './Song'

function Queue() {
    const [ appStore ] = useStore('appStore')

    return (
        appStore.queue.map(track => {
            return <Song key={track.id} song={track}/> 
        })
    )
}

export default Queue
