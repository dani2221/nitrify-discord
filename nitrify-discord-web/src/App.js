import React from 'react';
import logo from './logo.svg';
import './App.css';
import ManageChannel from './Containers/ManageChannel';
import LandingPage from './Components/LandingPage'
import { BrowserRouter as Router, Route, Switch, withRouter } from "react-router-dom";
import Commands from './Components/Commands';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route component={LandingPage} exact path='/'/>
          <Route component={ManageChannel} path='/manage'/>
          <Route component={Commands} path='/commands'/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
