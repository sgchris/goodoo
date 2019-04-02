import React, { Component } from 'react';
import { GoogleAuth, AuthProvider } from './services/Auth';
import NavBar from './components/NavBar';
import TodoList from './components/TodoList';

class App extends Component {
    isSignedIn = false;

    render() {

        //GoogleAuth.init()

        return (
            <AuthProvider value={googleAuth}>
                <NavBar />
                <TodoList />
            </AuthProvider>
        );
    }
}

export default App;
