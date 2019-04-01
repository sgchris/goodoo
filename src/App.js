import React, { Component } from 'react';
import { googleAuth, AuthProvider } from './services/Auth';
import NavBar from './components/NavBar';
import TodoList from './components/TodoList';

class App extends Component {
    render() {
        return (
            <AuthProvider value={googleAuth}>
                <NavBar />
                <TodoList />
            </AuthProvider>
        );
    }
}

export default App;
