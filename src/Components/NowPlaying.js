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
      <div className="NowPlaying">
        <img src={nowPlaying.album.images[0].url} alt="Album cover" />
        <div className="song-name">{nowPlaying.name}</div>
        <div className="artists">
          {nowPlaying.artists.map(artist => artist.name).join(", ")}
        </div>
        <button onClick={handleRefresh}>Refresh</button>
      </div>
    );
  } else {
    return (
      <div className="NowPlaying">
        <img src="/Static/album-cover.png" alt="qList Album Cover" />
        <div className="song-name">No songs in queue</div>
        <div className="artists">Please add a song</div>
        <button onClick={handleRefresh}>Refresh</button>
      </div>
    );
  }
}

export default NowPlaying;
