//Libraries and Packages import
import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//Component imports
import NavBar from './Components/NavBar';
import QueuePage from './Pages/QueuePage';
import IndexPage from './Pages/IndexPage';
import AboutPage from './Pages/AboutPage';


//Misc. imports
import './App.css';
 
function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact component={IndexPage}></Route>
          <Route path="/queue" component={QueuePage}></Route>
          <Route path="/about" component={AboutPage}></Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App;
