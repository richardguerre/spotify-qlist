import React, { useState, useEffect } from "react";
import { useStore } from "react-hookstore";
import spotifyApi from "spotify-web-api-js";

export default function AddToQueue() {
  //stores and states
  const [userInfo] = useStore("userInfo");
  const [text, setText] = useState("");
  const [results, setResults] = useState([]);
  //misc.
  const { socket } = userInfo;
  const spotify = new spotifyApi();
  spotify.setAccessToken(userInfo.accessToken);

  useEffect(() => {
    if (text !== "") {
      spotify
        .searchTracks(text, { limit: 5 })
        .then(res => {
          setResults(res);
        })
        .catch(err => console.log(err));
    } else setResults([]);
    // eslint-disable-next-line
  }, [text]);

  const handleAdd = (e, track) => {
    e.preventDefault();
    setText("");
    setResults([]);
    socket.emit("add-song", {
      partyName: userInfo.partyName,
      song: { ...track, votes: 0, status: "wannabe" }
    });
  };

  return (
    <div className="AddToQueue">
      <input
        type="text"
        placeholder="Add a song"
        onChange={e => setText(e.target.value)}
        value={text}
      />
      {results.tracks && results.tracks.items && (
        <table>
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {results.tracks.items.map(track => {
              return (
                <tr key={track.id} onClick={e => handleAdd(e, track)}>
                  <td>
                    <img
                      style={{ height: "40px" }}
                      src={track.album.images[0].url}
                      alt="album"
                    />
                  </td>
                  <td>{track.name}</td>
                  <td>{track.artists.map(artist => artist.name).join(",")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
