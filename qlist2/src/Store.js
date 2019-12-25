import { createStore } from 'react-hookstore';
import io from 'socket.io-client';

export default function initStore() {
  
  createStore('userInfo', {
    partyName : undefined,
    accessToken : undefined,
    socket : io('http://localhost:8080/')
  });

  createStore('queue', [])
}