import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar'
import List from './Components/List'

class App extends Component {
  render() {
    return (
        <div>
            <Navbar></Navbar>
            <List></List>
        </div>
    );
  }
}

export default App;
