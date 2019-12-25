//Libraries and Packages import
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//Component imports
import NavBar from './Components/NavBar';
import CreatePage from './Pages/CreatePage';
import QueuePage from './Pages/QueuePage';
import IndexPage from './Pages/IndexPage';
import AboutPage from './Pages/AboutPage';

//Misc. imports
import './App.css';
import initStore from './Store';

function App() {
  initStore(); //initialize global store

  return (
    <div className="App">
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact component={IndexPage}></Route>
          <Route path="/create" component={CreatePage}></Route>
          <Route path="/party/:partyName" component={QueuePage}></Route>
          <Route path="/about" component={AboutPage}></Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App;
