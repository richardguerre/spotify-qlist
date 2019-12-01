import { createStore } from 'react-hookstore';

function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
  hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

export default function initStore () {
  const params = getHashParams();

  createStore('appStore', 
    {
      accessToken : params.access_token,
      isLoggedIn : params.access_token ? true : false,
      userName : undefined,
      partyName : undefined,
      nowPlaying : {
        isPlaying : false
      },
      queue : [],
      queueSize : 0,
      deviceId : undefined,
      hasQueue : false
    }
  )
}
