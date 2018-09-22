import React, { Component } from 'react';
import { HashRouter as Router, Route } from "react-router-dom";

import Jukebox from '../views/Jukebox/Jukebox';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Route path="/" component={Jukebox} />
        </Router>
      </div>
    );
  }
}

export default App;
