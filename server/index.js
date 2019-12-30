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

let parties = {
  // test : {
  //   accessToken : '',
  //   queue : [
  //     {
  //       "album": {
  //         "external_urls": {
  //           "spotify": "https://open.spotify.com/album/0K4pIOOsfJ9lK8OjrZfXzd"
  //         },
  //         "id": "0K4pIOOsfJ9lK8OjrZfXzd",
  //         "images": [
  //           {
  //             "height": 640,
  //             "url": "https://i.scdn.co/image/ab67616d0000b2734c3bbcff5e7248e415548f12",
  //             "width": 640
  //           },
  //           {
  //             "height": 300,
  //             "url": "https://i.scdn.co/image/ab67616d00001e024c3bbcff5e7248e415548f12",
  //             "width": 300
  //           },
  //           {
  //             "height": 64,
  //             "url": "https://i.scdn.co/image/ab67616d000048514c3bbcff5e7248e415548f12",
  //             "width": 64
  //           }
  //         ]
  //       },
  //       "artists": [
  //         {
  //           "external_urls": {
  //             "spotify": "https://open.spotify.com/artist/4dpARuHxo51G3z768sgnrY"
  //           },
  //           "href": "https://api.spotify.com/v1/artists/4dpARuHxo51G3z768sgnrY",
  //           "id": "4dpARuHxo51G3z768sgnrY",
  //           "name": "Adele",
  //           "type": "artist",
  //           "uri": "spotify:artist:4dpARuHxo51G3z768sgnrY"
  //         }
  //       ],
  //       "duration_ms": 295493,
  //       "external_urls": {
  //         "spotify": "https://open.spotify.com/track/4sPmO7WMQUAf45kwMOtONw"
  //       },
  //       "id": "4sPmO7WMQUAf45kwMOtONw",
  //       "name": "Hello",
  //       "popularity": 73,
  //       "preview_url": "https://p.scdn.co/mp3-preview/0b90429fd554bad6785faa2b8931d613db4a0ee4?cid=eb753ba663c249e3b61a3969225930bf",
  //       "votes": 0,
  //       "status": "wannabe"
  //     },
  //     {
  //       "album": {
  //         "external_urls": {
  //           "spotify": "https://open.spotify.com/album/4m2880jivSbbyEGAKfITCa"
  //         },
  //         "id": "4m2880jivSbbyEGAKfITCa",
  //         "images": [
  //           {
  //             "height": 640,
  //             "url": "https://i.scdn.co/image/ab67616d0000b2731d97ca7376f835055f828139",
  //             "width": 640
  //           },
  //           {
  //             "height": 300,
  //             "url": "https://i.scdn.co/image/ab67616d00001e021d97ca7376f835055f828139",
  //             "width": 300
  //           },
  //           {
  //             "height": 64,
  //             "url": "https://i.scdn.co/image/ab67616d000048511d97ca7376f835055f828139",
  //             "width": 64
  //           }
  //         ]
  //       },
  //       "artists": [
  //         {
  //           "external_urls": {
  //             "spotify": "https://open.spotify.com/artist/4tZwfgrHOc3mvqYlEYSvVi"
  //           },
  //           "href": "https://api.spotify.com/v1/artists/4tZwfgrHOc3mvqYlEYSvVi",
  //           "id": "4tZwfgrHOc3mvqYlEYSvVi",
  //           "name": "Daft Punk",
  //           "type": "artist",
  //           "uri": "spotify:artist:4tZwfgrHOc3mvqYlEYSvVi"
  //         },
  //         {
  //           "external_urls": {
  //             "spotify": "https://open.spotify.com/artist/2RdwBSPQiwcmiDo9kixcl8"
  //           },
  //           "href": "https://api.spotify.com/v1/artists/2RdwBSPQiwcmiDo9kixcl8",
  //           "id": "2RdwBSPQiwcmiDo9kixcl8",
  //           "name": "Pharrell Williams",
  //           "type": "artist",
  //           "uri": "spotify:artist:2RdwBSPQiwcmiDo9kixcl8"
  //         },
  //         {
  //           "external_urls": {
  //             "spotify": "https://open.spotify.com/artist/3yDIp0kaq9EFKe07X1X2rz"
  //           },
  //           "href": "https://api.spotify.com/v1/artists/3yDIp0kaq9EFKe07X1X2rz",
  //           "id": "3yDIp0kaq9EFKe07X1X2rz",
  //           "name": "Nile Rodgers",
  //           "type": "artist",
  //           "uri": "spotify:artist:3yDIp0kaq9EFKe07X1X2rz"
  //         }
  //       ],
  //       "duration_ms": 369626,
  //       "external_urls": {
  //         "spotify": "https://open.spotify.com/track/69kOkLUCkxIZYexIgSG8rq"
  //       },
  //       "id": "69kOkLUCkxIZYexIgSG8rq",
  //       "name": "Get Lucky",
  //       "popularity": 74,
  //       "preview_url": "https://p.scdn.co/mp3-preview/28c1195dcc64c65223ed1f439886d50f4ded7ba6?cid=eb753ba663c249e3b61a3969225930bf",
  //       "votes": 0,
  //       "status": "wannabe"
  //     },
  //     {
  //       "album": {
  //         "external_urls": {
  //           "spotify": "https://open.spotify.com/album/2LyLlHg03okxUU3UVrKtSC"
  //         },
  //         "id": "2LyLlHg03okxUU3UVrKtSC",
  //         "images": [
  //           {
  //             "height": 640,
  //             "url": "https://i.scdn.co/image/38d1d935130cee7b836626f2eaa60d58b4a30cfe",
  //             "width": 640
  //           },
  //           {
  //             "height": 300,
  //             "url": "https://i.scdn.co/image/d4d41fcd96e6fbb3f790f5bdeb764714ac3d9cb4",
  //             "width": 300
  //           },
  //           {
  //             "height": 64,
  //             "url": "https://i.scdn.co/image/e7ff9936d6f5ea5ae6139a413cffb7387a34437f",
  //             "width": 64
  //           }
  //         ]
  //       },
  //       "artists": [
  //         {
  //           "external_urls": {
  //             "spotify": "https://open.spotify.com/artist/6s22t5Y3prQHyaHWUN1R1C"
  //           },
  //           "href": "https://api.spotify.com/v1/artists/6s22t5Y3prQHyaHWUN1R1C",
  //           "id": "6s22t5Y3prQHyaHWUN1R1C",
  //           "name": "AJR",
  //           "type": "artist",
  //           "uri": "spotify:artist:6s22t5Y3prQHyaHWUN1R1C"
  //         }
  //       ],
  //       "duration_ms": 201159,
  //       "external_urls": {
  //         "spotify": "https://open.spotify.com/track/5DZwnLxHjWTZaz9jOpRhxb"
  //       },
  //       "id": "5DZwnLxHjWTZaz9jOpRhxb",
  //       "name": "Weak",
  //       "popularity": 72,
  //       "preview_url": "https://p.scdn.co/mp3-preview/887c1a2b75acb712cee7e9c88cfbab6bce56dc8e?cid=eb753ba663c249e3b61a3969225930bf",
  //       "votes": 0,
  //       "status": "wannabe"
  //     }
  //   ]    
  // }
};

const client_id = process.env.CLIENT; 
const client_secret = process.env.SECRET;
const redirect_uri = process.env.REDIRECT;
let publicToken;
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
    res.err()
  }
})

//retrieve now playing in each party every 15s
setInterval( () => {//retrieve now playing in each party every 15s
  console.log('retrieving now playing')
  const partyNames = Object.keys(parties)
  partyNames.forEach( (partyName) => {
    spotifyApi.setAccessToken(parties[partyName].accessToken);
    spotifyApi.getMyCurrentPlayingTrack()
      .then( (res) => {
        // console.log(res, partyName)
        let changes = false;
        parties[partyName].queue.filter( (song) => {
          if(song.status === 'nowPlaying' && song.id !== res.body.item.id){
            song.status = 'hasbeen';
            song.votes = 0;
            console.log(`song ${song.name} hasbeen`)
            return true;
          }
          if(song.id === res.body.item.id){
            song.status = 'nowPlaying'
            console.log(`song ${song.name} is now playing on spotify`)
            changes = true;
            return true;
          }
        })
        if(changes){
          console.log('sent updated queue')
          changes = false;
          io.to(partyName).emit('update', parties[partyName].queue)
        }
      }).catch( err => console.log(err));
  })
}, 15000)

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

  socket.on('disconnect', () => console.log(`user ${socket.id} disconnected`))
})

http.listen(8080, (err) => { // server listening...
  if(err) throw err; 
  console.log(`Listening on port 8080...`);
});