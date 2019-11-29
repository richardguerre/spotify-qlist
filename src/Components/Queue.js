import React from 'react'
import Song from './Song'

export default function Queue({queue}) {
    return (
        queue.map(track => {
            return <Song song={track}/> 
        })
    )
}
