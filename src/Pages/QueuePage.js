//import libraries
import React, { useEffect } from "react";
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
  // eslint-disable-next-line
  const [nowPlaying, setNow] = useStore("nowPlaying");
  // eslint-disable-next-line
  const [hasbeen, setHasbeen] = useStore("hasbeen");
  //Misc.
  const { partyName } = useParams();

  function segQueue(party) {
    const nowPlayingIndex = party.findIndex( (song) => song.status === "nowPlaying");
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
        window.location.href = "/not-found";
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
  };

  if (userInfo.partyName && userInfo.accessToken && queue) {
    return (
      <>
        <h1>{userInfo.partyName}</h1>
        <NowPlaying />
        <AddToQueue />
        <h5>Queue</h5>
        <ul>
          {queue.map(song => {
            if (song.status === "wannabe") {
              return (
                <li key={song.id}>
                  <img
                    style={{ height: "40px" }}
                    src={song.album.images[0].url}
                    alt="Album cover"
                  />
                  {" " + song.name + " " + song.votes + " "}
                  {song.status === "nowPlaying" ? (
                    "Now Playing"
                  ) : (
                    <button onClick={e => handleVote(e, song)}>^</button>
                  )}
                </li>
              );
            } else return <li key="empty"></li>;
          })}
        </ul>
        <RecentlyPlayed />
        <img
          src={`https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=https://qlist.herokuapp.com/party/${partyName}&choe=UTF-8`}
          alt="qList QR code"
        />
      </>
    );
  } else {
    return <h1>Loading...</h1>;
  }
}
