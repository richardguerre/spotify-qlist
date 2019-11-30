import React, { useState, useEffect } from 'react'
import { createStore, useStore } from 'react-hookstore';

createStore('resultsStore', 0);
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

export default function AddToQueue(props)
{
  const token = props.token;

  const [results, setResults] = useStore('resultsStore');

  const placeholder = "Add to queue";

  function handleChange(e)
  {
    if (e.target.value !== '')
    {
      searchTracks(e.target.value);
    } else
    {
      setResults([]);
    }
  }

  async function searchTracks(query)
  {

    fetch(`${SPOTIFY_API_BASE}/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(async (response) => await response.json()).then((data) => {
      setResults(data.tracks.items);
    });
  }

    return (
      <div>
      <input placeholder={placeholder}
        onChange={handleChange}
        />
      {results && <ResultsList />}
      </div>
    )
}

function ResultsList()
{
  const [results] = useStore('resultsStore');

  if (results === [])
  {
    return (<span></span>);
  }
  return (
    <ul className="add-to-queue__search-results">
      <style jsx>{`
        .add-to-queue__search-results {
          border: 1px solid #999;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .add-to-queue__search-results-item {
          padding: 5px 0 5px 5px;
        }
        .add-to-queue__search-results-item--focused {
          background-color: #eee;
        }
        .container{
          display: flex;
        }
        .album-img{
            width: 64;
            padding-right: 1em;
        }
        .flex-item{
            flex-grow: 1;
        }

        .song-name {
          font-size: 1.3em;
          margin-bottom: 0.3em;
        }
      `}</style>
      {results.map((r, index) => {
        return (
          <li key={r, index}>
            <div className="container">
              <div className="album-img">
                <img src={r.album.images[2].url}/>
              </div>
              <div className="flex-item">
                <div className="song-name">{r.name}</div>
                <div>{r.artists[0].name}</div>
              </div>
            </div>
            <button>Add</button>
          </li>
        );
      })}
    </ul>
  );
}