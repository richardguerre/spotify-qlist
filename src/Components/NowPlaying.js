import React from "react";
import { useStore } from "react-hookstore";

function NowPlaying() {
  const [userInfo] = useStore("userInfo");
  const { socket } = userInfo;
  const [nowPlaying] = useStore("nowPlaying");

  const handleRefresh = () => {
    socket.emit("refresh", { partyName: userInfo.partyName });
  };

  if (
    nowPlaying !== undefined &&
    nowPlaying.album !== undefined &&
    nowPlaying.album.images !== undefined
  ) {
    return (
      <>
        <img
          style={{ height: "110px" }}
          src={nowPlaying.album.images[0].url}
          alt="Album cover"
        />
        <strong>{nowPlaying.name}</strong>
        {" by " + nowPlaying.artists[0].name}
        <button onClick={handleRefresh}>Refresh</button>
      </>
    );
  } else {
    return (
      <>
        <button onClick={handleRefresh}>Refresh</button>
      </>
    );
  }
}

export default NowPlaying;
