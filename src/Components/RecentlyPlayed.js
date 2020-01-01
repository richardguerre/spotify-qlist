import React from "react";
import { useStore } from 'react-hookstore';

function RecentlyPlayed() {
  const [ hasbeen ] = useStore('hasbeen');
  
  if (hasbeen.length > 0) {
    return (
      <div>
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
      </div>
    );
  } else {
    return <></>;
  }
}

export default RecentlyPlayed;
