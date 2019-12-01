//Libraries and Packages import
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import Spotify from 'spotify-web-api-js';
// import { useStore } from 'react-hookstore';

//Component imports
import initStore from './Store';
import NavBar from './Components/NavBar';
import CreatePage from './Pages/CreatePage';
import QueuePage from './Pages/QueuePage';
import IndexPage from './Pages/IndexPage';
import AboutPage from './Pages/AboutPage';
// import { StatefullHello, AnotherComponent} from './Components/Example-Store';

//Misc. imports
import './App.css';

function App() {
  initStore(); //initialize global state/store
  // const spotifyApi = new Spotify()
  // const [ appStore, setStore ] = useStore('appStore')
  
  // if(appStore.accessToken){
  //   spotifyApi.setAccessToken(appStore.accessToken);

  //   spotifyApi.getMe()
  //     .then((data) => setStore({...appStore, userName: data.display_name}), (err) => console.error("error: could not get user's info"))    
  // }

  return (
    <div className="App">
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact component={IndexPage}></Route>
          <Route path="/create" component={CreatePage}></Route>
          <Route path="/queue" component={QueuePage}></Route>
          <Route path="/about" component={AboutPage}></Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App;
