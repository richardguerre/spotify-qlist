//import libraries
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "react-hookstore";
//import components
import AddToQueue from "../Components/AddToQueue";
import NowPlaying from '../Components/NowPlaying';
//import misc.

export default function QueuePage() {
  //stores and states
  const [userInfo, setUser] = useStore("userInfo");
  const { socket } = userInfo;
  const [queue, setQueue] = useStore("queue");
  // eslint-disable-next-line
  const [nowPlaying, setNow] = useStore("nowPlaying");
  const [hasbeen, setHasbeen] = useStore("hasbeen");
  //Misc.
  const { partyName } = useParams();

  useEffect(() => {
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
        const nowPlayingIndex = res.party.findIndex(song => {
          return song.status === "nowPlaying";
        });
        setQueue(res.party.slice(nowPlayingIndex+1, queue.length));
        setNow(res.party[nowPlayingIndex]);
        setHasbeen(res.party.slice(0, nowPlayingIndex))
      }
    });
    socket.on("update", queue => {
      console.log("received update", queue);
      const nowPlayingIndex = queue.findIndex(song => {
        return song.status === "nowPlaying";
      });
      setQueue(queue.slice(nowPlayingIndex + 1, queue.length));
      setNow(queue[nowPlayingIndex]);
      setHasbeen(queue.slice(0, nowPlayingIndex));
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
        <ul>
          {queue.map(song => {
            if (song.status === "wannabe" || song.status === "nowPlaying") {
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
        <h5>Recently played</h5>
        <ul>
          {hasbeen.map(song => {
            if (song.status === "hasbeen") {
              return (
                <li key={song.id}>
                  <img
                    style={{ height: "40px" }}
                    src={song.album.images[0].url}
                    alt="Album cover"
                  />
                  {" " + song.name}
                </li>
              );
            } else return <li key="empty"></li>;
          })}
        </ul>
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
