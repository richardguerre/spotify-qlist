import React from 'react'

export default function Song({song}) {
    return (
        <div>
            <label>
                <button>upVote</button>
                    {song.name} <span> </span>
                    {song.author}
            </label>
        </div>
    )
}
