const express = require('express'); // Express web server framework
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');

{ //Serving frontend
  
}

{ // Auth config
  const auth = require('./auth.js');
  app.use('/', auth);
}

{ // socket io rooms implementation
  io.on('connection', (socket) => {
    console.log(`user ${socket.id} has connected`);
    socket.on('create-party', ({partyName, accToken}) => {
      fs.writeFile(`./Database/${partyName}.json`, JSON.stringify({
        accessToken : accToken,
        queue : undefined
      }), (err) => {
        if(err) throw err;
        socket.join(`${partyName}`)
      })
    })
    // socket.on('join-party', (data) => {
    //   const {partyName} = data;
    //   socket.join(`${partyName}`)
    //   fs.readFile(`./Database/${partyName}.json`, (err, raw) => {
    //     const error = {
    //       status: 404
    //     }
    //     if (err)
    //       socket.to(socket.id).emit('join-party', error)
    //     const data = JSON.parse(raw)
    //     socket.to(socket.id).emit('join-party', data);
    //   })
    // })
    // socket.on('add-song', (data) => {
    //   console.log(data);
    // })
    

    socket.on('disconnect', () => console.log(`user ${socket.id} has disconnected`))
  })
}

http.listen(8888, (err) => { // server listening...
  if(err) throw err;
  console.log('Listening on port 8888...');
});
