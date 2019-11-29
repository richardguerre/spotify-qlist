//Libraries and Packages import
import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';

//Component imports
import NavBar from './Components/NavBar'
import Queue from './Components/Queue';
import NowPlaying from './Components/NowPlaying';

//Misc. imports
import './App.css';
 
function App() {
  const [fakeQueue, setFakeQueue] = useState([
    {
      id: 1,
      name: "Despacito",
      author: "Luis Fonsi",
      playing: false,
      votes: 0
    },
    {
      id: 2,
      name: "Despacito2",
      author: "Luis Fonsi",
      playing: false,
      votes: 0
    }
  ]);

  const IndexPage = () => {
    return (
      <div className="IndexPage">
        <h1>Welcome qLister!</h1>
        <p>Please choose between creating a qList party or joing one!</p>
        <Link href={"http://localhost:8888/"}><h2>Create</h2></Link>
        <Link to={"/queue"}><h2>Join</h2></Link>
      </div>)
  }
  const QueuePage = () => {
    return (
    <div className="QueuePage">
      <NowPlaying />
      <input type="text" placeholder="Add a song!" />
      <button>Add</button>
      <Queue queue={fakeQueue}/>
      {/* QR code to be added */}
    </div>
    )
  }
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact component={IndexPage}></Route>
          <Route path="/queue" component={QueuePage}></Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App;
