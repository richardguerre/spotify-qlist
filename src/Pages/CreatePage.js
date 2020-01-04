//import libraries
import React, { useState, useEffect } from "react";
import { useStore } from "react-hookstore";
import spotifyApi from "spotify-web-api-js";
import axios from "axios";

//import user components

//import misc.

//Misc. variables and functions
const getHashParams = () => {
  var hashParams = {};
  var e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  // eslint-disable-next-line
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
};

export default function CreatePage() {
  //stores and states
  const [userInfo, setUser] = useStore("userInfo");
  const [partyName, setName] = useState("");

  //other miscellaneous
  const params = getHashParams();
  const spotify = new spotifyApi();
  spotify.setAccessToken(params.access_token);

  useEffect(() => {
    spotify
      .getMe()
      .then(res => {
        console.log("user is", res.product);
        setUser({ ...userInfo, isPremium: res.product });
      })
      .catch(err => console.log(err));
    // eslint-disable-next-line
  }, [setUser]);

  //Handle event listeners
  const handleSubmit = e => {
    e.preventDefault(); //prevents page from reloading
    axios
      .post("/api/create", {
        partyName: partyName,
        privateToken: params.access_token
      })
      .then(res1 => {
        //{data: {partyName : '...', albumCover : '...'}}
        console.log(res1);
        spotify
          .uploadCustomPlaylistCoverImage(
            res1.data.playlistId,
            res1.data.albumCover
          )
          .then(res2 => {
            console.log("qList album cover uploaded", res2);
            window.location.href = `/party/${partyName}`;
          })
          .catch(err => {
            console.log("could not uploadCoverImage", err);
            window.location.href = `/party/${partyName}`;
          });

        setUser({
          ...userInfo,
          partyName: res1.data.partyName
        });
        setName("");
      })
      .catch(err => {
        setName("");
        console.log(err);
      });
  };

  return (
    <div className="CreatePage">
      <img src="/Static/logo.png" alt="qList logo"/>
      <h1>CREATE</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="room"
          type="text"
          onChange={e => setName(e.target.value)}
          value={partyName}
          placeholder="Party Name"
          required
        />
        <div>
          <h4>How to create and play your party:</h4>
          <div className="sub-title">
            (make sure there is a song in the queue)
          </div>
          <ol className="text">
            <li>Open Spotify (mobile or desktop app) </li>
						<li>Go to your playlists</li>
						<li>(Mobile) Go to “Your Library” > “Playlists”<br/>
	(Desktop) On the left sidebar, in "Playlists", you should see "qList - {partyName || 'Party Name'}"</li>
						<li>Press the play button on “qList - {partyName || 'Party Name'}”, or play the first track in that playlist</li>
          </ol>
          <br/>
          <p>Note: You can play/pause, but please do not skip forwards/backwards on spotify as this will cause the voting system to fail. </p>
          {partyName && (
            <>
              <h5>Share your party</h5>
              <img
								className="qrcode"
                src={`https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=https://qlist.herokuapp.com/party/${partyName}&choe=UTF-8`}
                alt="qList QR code"
                download={`qList - ${partyName}`}
              />
              <a
                href={`https://chart.googleapis.com/chart?cht=qr&chs=400x400&chl=https://qlist.herokuapp.com/party/${partyName}&choe=UTF-8`}
                download={`qList - ${partyName}`}
              >
                Download QR code
              </a>
            </>
          )}
        </div>
				<button type="submit" className="btn">Create</button>
      </form>
    </div>
  );
}
