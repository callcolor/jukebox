import React, { Component } from 'react';
import { HashRouter as Router, Route, Routes } from "react-router-dom";

import Jukebox from '../views/Jukebox/Jukebox';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Jukebox/>} />
          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;
