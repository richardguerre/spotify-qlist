//import libraries
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "react-hookstore";
//import components
import AddToQueue from "../Components/AddToQueue";
import NowPlaying from "../Components/NowPlaying";
import RecentlyPlayed from "../Components/RecentlyPlayed";
//import misc.

export default function QueuePage() {
  //stores and states
  const [userInfo, setUser] = useStore("userInfo");
  const { socket } = userInfo;
  const [queue, setQueue] = useStore("queue");
  const [voted, setVoted] = useState([]);
  // eslint-disable-next-line
  const [nowPlaying, setNow] = useStore("nowPlaying");
  // eslint-disable-next-line
  const [hasbeen, setHasbeen] = useStore("hasbeen");
  //Misc.
  const { partyName } = useParams();

  function segQueue(party) {
    const nowPlayingIndex = party.findIndex(
      song => song.status === "nowPlaying"
    );
    setQueue(party.filter(song => song.status === "wannabe"));
    setNow(party[nowPlayingIndex]);
    setHasbeen(party.filter(song => song.status === "hasbeen"));
  }

  useEffect(() => {
    console.log(partyName);
    socket.emit("join-party", partyName);
    socket.on("join-party", res => {
      //party may not exist
      console.log(res);
      if (res === "party not found") {
        window.location.href = "/#/not-found";
      } else {
        setUser({
          ...userInfo,
          accessToken: res.accessToken,
          partyName: partyName
        });
        segQueue(res.party);
      }
    });
    socket.on("update", queue => {
      console.log("received update", queue);
      segQueue(queue);
    });
    // eslint-disable-next-line
  }, [socket, partyName, setQueue, setUser]);

  const handleVote = (e, song) => {
    socket.emit("vote", { partyName: userInfo.partyName, song: song });
    e.target.disabled = true;
    setVoted([...voted, song.id]);
    // voted.push(song.id);
  };

  if (userInfo.partyName && userInfo.accessToken) {
    return (
      <div className="QueuePage">
        <img className="logo" src="/Static/logo.png" alt="logo"/>
        {/* <h1>{userInfo.partyName}</h1> */}
        <NowPlaying />
        <AddToQueue />
        <div className="Queue">
          {queue.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Name</th>
                  <th scope="col">Votes</th>
                  <th scope="col">Duration</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {queue.map(song => {
                  if (song.status === "wannabe") {
                    return (
                      <tr key={song.id}>
                        <td>
                          <img
                            style={{ height: "40px" }}
                            src={song.album.images[0].url}
                            alt="Album cover"
                          />
                        </td>
                        <td>{song.name}</td>
                        <td>{song.votes}</td>
                        <td>
                          {Math.floor(song.duration_ms / 1000 / 60) +
                            ":" +
                            Math.floor((song.duration_ms / 1000) % 60)}
                        </td>
                        <td>
                          {voted.filter(id => song.id === id).length === 0 && (
                            <img
                              className="upvote"
                              onClick={e => handleVote(e, song)}
                              src="/Static/up-vote.png"
                              alt="up-vote btn"
                            />
                          )}
                        </td>
                      </tr>
                    );
                  } else return <tr key=""></tr>;
                })}
              </tbody>
            </table>
          ) : (!nowPlaying && (
            <div className="how-to">
              <h4>How to create and play your party:</h4>
              <div className="sub-title">
                (make sure there is a song in the queue)
              </div>
              <ol className="text">
                <li>Open Spotify (mobile or desktop app) </li>
                <li>Go to your playlists</li>
                <li>
                  (Mobile) Go to “Your Library” > “Playlists”
                  <br />
                  (Desktop) On the left sidebar, in "Playlists", you should see
                  "qList - {partyName || "Party Name"}"
                </li>
                <li>
                  Press the play button on “qList - {partyName || "Party Name"}
                  ”, or play the first track in that playlist
                </li>
              </ol>
              <br />
              <p>
                Note: You can play/pause, but please do not skip
                forwards/backwards on spotify as this will cause the voting
                system to fail.{" "}
              </p>
            </div>
          ))}
        </div>
        <RecentlyPlayed />
        <img
          className="qrcode"
          src={`https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=https://qlist.herokuapp.com/party/${partyName}&choe=UTF-8`}
          alt="qList QR code"
        />
      </div>
    );
  } else {
    return <h1>Loading...</h1>;
  }
}
