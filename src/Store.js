import { createStore } from 'react-hookstore';
import io from 'socket.io-client'

export default function initStore() {
  
  createStore('userInfo', {
    partyName : undefined,
    accessToken : undefined,
    isPremium : false,
    socket : io('http://qlist.herokuapp.com/')
  });

  createStore('queue', [])
  createStore('nowPlaying', {})
  createStore('hasbeen', [])
}