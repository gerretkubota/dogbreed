import React, {Component} from 'react';
import {BrowserRouter as Router, NavLink, Route} from 'react-router-dom';

import Breeds from './Breeds';

import '../index.css';

class App extends Component {
  render(){
    return(
      <Router>
        <div className='mainDiv'>
          <h1>Dog Breeds</h1>
          <div className='content'>
            <Route exact path='/' component={Breeds}/>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;