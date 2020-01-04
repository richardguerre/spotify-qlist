import React from "react";
import { useStore } from "react-hookstore";

function RecentlyPlayed() {
  const [hasbeen] = useStore("hasbeen");

  if (hasbeen.length > 0) {
    return (
      <div className="RecentlyPlayed">
        <h5>Recently played</h5>
        <table>
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">Name</th>
              <th scope="col">Duration</th>
            </tr>
          </thead>
          <tbody>
            {hasbeen.map(song => {
              if (song.status === "hasbeen") {
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
                    <td>
                      {Math.floor(song.duration_ms / 1000 / 60) +
                        ":" +
                        Math.floor((song.duration_ms / 1000) % 60)}
                    </td>
                  </tr>
                );
              } else return <tr key=""></tr>;
            })}
          </tbody>
        </table>
      </div>
    );
  } else {
    return <></>;
  }
}

export default RecentlyPlayed;
