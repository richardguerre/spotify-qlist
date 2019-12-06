import React, { useRef } from 'react'
import { createStore, useStore } from 'react-hookstore';
import Spotify from 'spotify-web-api-js';

createStore('resultsStore',0)

function AddToQueue(){
  const [appStore] = useStore('appStore');
  const spotifyApi = new Spotify();
  spotifyApi.setAccessToken(appStore.accessToken);
  
  const [results, setResults] = useStore('resultsStore');
  const placeholder = "Add to queue";
  
  const handleChange = (e) =>
  {
    if (e.target.value !== '')
    {
      spotifyApi.searchTracks(e.target.value).then((response) => {
        setResults(response.tracks.items);
      } )
    } else setResults([])
  }
  
  
  const inputEl = useRef(null);
  const handleAdd = () => {
      inputEl.current.value = '';
      inputEl.current.focus();
  }
  
  
  return (
    <div>
      <input ref={inputEl} placeholder={placeholder}
        onChange={handleChange}
        />
      {results && <ResultsList added={handleAdd}/>}
      </div>
    )
  }
  
  function ResultsList({added})
  {
    const [results] = useStore('resultsStore');
    
    if (results === [])
    {
      return (<span style="display:none"></span>);
    }
    
    const handleAdd = () => added()
    return (
      <ul className="add-to-queue__search-results">
      <style >{`
        li:hover {
          background : rgb(87, 181, 96);
        }
        .add-to-queue__search-results {
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
          // margin-bottom: 0.3em;
        }
        `}</style>
      {results.map((r, index) => {
        return <Result key={index} track={r} added={handleAdd}/>
      })}
    </ul>
  );
}

function Result({track, added}) {
  const [ appStore, setStore ] = useStore('appStore');
  const [ results, setResults ] = useStore('resultsStore');
  const [ playlist ] = useStore('playlist');
  const song = {
    id: track.id,
    name: track.name,
    artists: track.artists.map( (artist) => artist.name),
    images: track.album.images.map( (image) => image.url),
    playUrl : track.external_urls.spotify,
    votes: 0,
  }
  const spotifyApi = new Spotify();
  
  const handleAdd = (e) =>
  {
    setStore({...appStore, queue : [...appStore.queue, song], hasQueue : true });
    setResults([]);
    added();
    spotifyApi.addTracksToPlaylist(playlist.id, [track.uri])
      .then( (err, res) => {
        err?console.log(err):console.log(res)
      });
  }

  return (
    <li onClick={handleAdd}>
      <div className="container">
        <div className="album-img">
          <img src={track.album.images[2].url}/>
        </div>
        <div className="flex-item">
          <div className="song-name">{track.name}</div>
          <div>{track.artists[0].name}</div>
        </div>
      </div>
    </li>
  )
}

export default AddToQueue;