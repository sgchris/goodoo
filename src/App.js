import React, { Component } from 'react';
import NavBar from './components/NavBar';
import TodoList from './components/TodoList';

class App extends Component {
    render() {
        return (
            <div>
                <NavBar />
                <TodoList />
            </div>
        );
    }
}

export default App;
