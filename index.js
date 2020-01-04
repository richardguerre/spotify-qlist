const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const request = require('request')
const bodyParser = require('body-parser');
const cors = require('cors');
const querystring = require('query-string');
const cookieParser = require('cookie-parser');
const spotifyWebApi = require('spotify-web-api-node');

const albumCover = require('./Static/albumCover');

require('dotenv').config();
const spotifyApi = new spotifyWebApi();
app.use(bodyParser.json())

let parties = {};

const client_id = process.env.CLIENT; 
const client_secret = process.env.SECRET;
const redirect_uri = process.env.REDIRECT;
let publicToken;
console.log(client_id, client_secret, redirect_uri);
{//fetching public token for all parties
  const authOptions = {url: 'https://accounts.spotify.com/api/token',headers: {'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))},form: {grant_type: 'client_credentials'},json: true};
  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200){
      publicToken = body.access_token;
      // console.log(publicToken)
    }
  });
}

{//spotify login routes
  /**
   * Generates a random string containing numbers and letters
   * @param  {number} length The length of the string
   * @return {string} The generated string
   */
  const generateRandomString = function(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  const stateKey = 'spotify_auth_state';

  app.use(cors());
  app.use(cookieParser());

  app.get('/api/login', function(req, res) {
    const state = generateRandomString(16); 
    res.cookie(stateKey, state);

    // your application requests authorization
    const scope = 'user-read-private user-read-email ugc-image-upload playlist-modify-public user-read-playback-state';
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      }));
  });

  app.get('/api/callback', function(req, res) {

    // your application requests refresh and access tokens
    // after checking the state parameter
    
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;
    
    if (state === null || state !== storedState) {
      res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
    } else {
      res.clearCookie(stateKey);
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };
      
      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          
          var access_token = body.access_token,
          refresh_token = body.refresh_token;
          
          // we can also pass the token to the browser to make requests from there
          res.redirect('http://localhost:3000/create/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
        } else {
          res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
        }
      });
    }
  });
  
  app.get('/refresh_token', function(req, res) {
    
    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
    
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }
    });
  });
}

let refreshNextPlaying;
const getNextPlaying = (partyName, time) => {
  console.log(`getting nextPlaying for party ${partyName} in ${time}ms`)
  refreshNextPlaying = setTimeout( () => {
    console.log(`getNowPlaying for party ${partyName}`)
    spotifyApi.getMyCurrentPlayingTrack()
      .then( (res) => {
        let changes = false;
        parties[partyName].queue.filter( (song) => {
          if(song.status === 'nowPlaying' && song.id !== res.body.item.id){
            console.log(`song ${song.name} hasbeen`);
            song.status = 'hasbeen';
            changes = true;
          }
          if(song.id === res.body.item.id){
            console.log(`song ${song.name} is now playing on spotify`);
            song.status = 'nowPlaying';
            song.votes = 0;
            song.progress = res.body.progress_ms;
            changes = true;
            return true;
          }
        })
        if(changes){
          changes = false;
          io.to(partyName).emit('update', parties[partyName].queue)
          console.log('sent updated queue')
          if(parties[partyName].queue.filter( (song) => song.status === 'wannabe').length > 0)
            getNextPlaying(partyName, res.body.item.duration_ms-res.body.progress_ms+100)
        }
      }).catch( (err) => console.log(err))
  }, time)
}


const getNowPlaying = (partyName) => {
  console.log(`getNowPlaying for party ${partyName}`)
  console.log(partyName);
  spotifyApi.setAccessToken(parties[partyName].accessToken)
  const getCurrent = () => {
    spotifyApi.getMyCurrentPlayingTrack()
      .then( (res) => {
        let changes = false;
        parties[partyName].queue.filter( (song) => {
          if(song.status === 'nowPlaying' && song.id !== res.body.item.id){
            console.log(`song ${song.name} hasbeen`);
            song.status = 'hasbeen';
            changes = true;
          }
          if(song.id === res.body.item.id){
              console.log(`song ${song.name} is now playing on spotify`);
              song.status = 'nowPlaying';
              song.votes = 0;
              song.progress = res.body.progress_ms;
              changes = true;
              return true;
            }
          })
          if(changes){
              io.to(partyName).emit('update', parties[partyName].queue)
              console.log('sent updated queue');
              changes = false;
              clearInterval(refreshNowPlaying);
              console.log(res.body)
              if(parties[partyName].queue.filter( (song) => song.status === 'wannabe').length > 0)
                getNextPlaying(partyName, res.body.item.duration_ms-res.body.progress_ms+100);
            }
          }).catch( (err) => console.log(err))
      }
      let refreshNowPlaying;
      if(parties[partyName].queue.length > 1){
        getCurrent(partyName);
      } else { 
        refreshNowPlaying = setInterval(getCurrent, 5000)
      }
}

app.post('/api/create', (req, res) => {
  if(!parties[req.body.partyName]){
    spotifyApi.setAccessToken(req.body.privateToken);
    spotifyApi.getMe()
      .then( res1 => {
        console.log(res1.body.id)
        spotifyApi.createPlaylist(res1.body.id, 'qList - '+req.body.partyName, {
          "public" : true,
          "description" : "Playlist created from qList",
        })
        .then( (res2) => {
          console.log(res1.body.id, res2.body.id, 'albumCover.albumCover')
          parties[req.body.partyName] = { accessToken: req.body.privateToken, playlistId : res2.body.id, queue : []};
          console.log(`added party "${req.body.partyName}"`);
          const response = {
            partyName : req.body.partyName,
            albumCover : albumCover.albumCover,
            playlistId : res2.body.id,
          }
          res.send(response);
        }).catch( (err) => console.log('could not createPlaylist', err))
      }).catch( (err) => console.log('could not getMe', err))
  } else {
    console.log(`party "${req.body.partyName}" already exists`)
    // res.err()
  }
})

io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected`);

  socket.on('join-party', (partyName) => {
    let response; //party may or may not exist, thus must either send queue or send party not found.
    if(parties[partyName]){
      response = { party: parties[partyName].queue, accessToken : publicToken };
      socket.join(partyName);
    } else {
      response = 'party not found';
    }
    console.log(response);
    io.to(socket.id).emit('join-party', response)
  })

  socket.on('add-song', (obj) => {
    if(!parties[obj.partyName].queue.find(song => song.id === obj.song.id)){
      spotifyApi.setAccessToken(parties[obj.partyName].accessToken)
      spotifyApi.addTracksToPlaylist(parties[obj.partyName].playlistId, [obj.song.uri])
        .then( (res) => {
          console.log('spotifyApi response =', res);
          if(parties[obj.partyName].queue.length === 0){
            console.log(parties);
            console.log(obj.partyName);
            getNowPlaying(obj.partyName);
          }
          parties[obj.partyName].queue.push(obj.song);
          console.log(parties[obj.partyName].queue)
          io.to(obj.partyName).emit('update', parties[obj.partyName].queue)
        }).catch( (err) => console.log(err));
    }
  })

  socket.on('vote', (obj) => {
    //increment vote for song and also return index before sort
    const songIndex1 = parties[obj.partyName].queue.findIndex( (song) => {
      if(song.id === obj.song.id){
        song.votes++;
        return true;
      }
    });
    //reorder songs (status===wannabe) in queue
    parties[obj.partyName].queue.sort( (song1, song2) => {
      if(song1.status === 'wannabe' && song2.status === 'wannabe'){
        if(song1.votes < song2.votes){
          return 1;
        } else if(song1.votes === song2.votes){
          return 0;
        } else {
          return -1;
        }
      }
    }) 

    const songIndex2 = parties[obj.partyName].queue.findIndex( (song) => {
      return (song.id === obj.song.id)
    });
    // console.log(songIndex1, songIndex2)
    if(songIndex1 !== songIndex2){
      spotifyApi.setAccessToken(parties[obj.partyName].accessToken);
      spotifyApi.reorderTracksInPlaylist(parties[obj.partyName].playlistId, songIndex1, songIndex2)
        .then( (res) => console.log('reordered playlist in spotify', res.statusCode))
        .catch( err => console.log(err));
    }
    
    console.log(`added vote on song ${obj.song.name} in party ${obj.partyName}`);
    io.to(obj.partyName).emit('update', parties[obj.partyName].queue)
  })

  socket.on('refresh', (obj) => {
    clearTimeout(refreshNextPlaying);
    getNowPlaying(obj.partyName)
  })

  socket.on('disconnect', () => console.log(`user ${socket.id} disconnected`))
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../build'));

   app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
  })
}

const port = process.env.PORT || 8080; 

http.listen(port, (err) => { // server listening...
  if(err) throw err;
  console.log(`Listening on port ${port}...`);
});