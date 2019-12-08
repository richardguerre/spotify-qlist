const express = require('express'); // Express web server framework
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');

{ // Auth config
  const auth = require('./auth.js');
  app.use('/', auth);
}

{ // socket io rooms implementation
  io.on('connection', (socket) => {
    console.log(`user ${socket.id} has connected`);
    socket.on('disconnect', () => console.log(`user ${socket.id} has disconnected`))
  })
}

http.listen(8888, (err) => { // server listening...
  if(err) throw err;
  console.log('Listening on port 8888...');
});
