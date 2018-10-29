import React, { Component } from 'react';
import Game from './Components/Game';
import _ from 'lodash';

import './App.css';
import Numbers from './Components/Numbers';

Numbers.list = _.range(1,10);

class App extends Component {
  render() {
    return (
      <div className="App">
        <Game />
      </div>
    );
  }
}

export default App;
