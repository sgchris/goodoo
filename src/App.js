import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar'
import List from './Components/List'

class App extends Component {
  render() {
    return (
      <div>
        <div>
            <Navbar></Navbar>
        </div>
        <div className="container">
            <List></List>
        </div>
      </div>
    );
  }
}

export default App;
