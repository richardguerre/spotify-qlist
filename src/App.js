import React from 'react';
import {HashRouter as Router, Switch, Route } from 'react-router-dom';

// import NavBar from './Components/NavBar';
import CreatePage from './Pages/CreatePage.js';
import QueuePage from './Pages/QueuePage';
import IndexPage from './Pages/IndexPage';
import NotFoundPage from './Pages/NotFoundPage';

import './App.css';
import initStore from './Store';

function App() {
	initStore();
	
	return (
		<div className="App">
			<Router basename="/">
				<Switch>
					<Route path="/" exact component={IndexPage}/>
					<Route path="/create" component={CreatePage}/>
					<Route path="/party/:partyName" component={QueuePage}/>
					<Route path="/not-found" component={NotFoundPage}/>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
