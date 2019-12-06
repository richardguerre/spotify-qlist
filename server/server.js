const express = require('express'); // Express web server framework
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');

const auth = require('./auth.js');

app.use('/', auth);

app.listen(8888, (err) => {
  if(err) throw err;
  console.log('Listening on port 8888...');
});
