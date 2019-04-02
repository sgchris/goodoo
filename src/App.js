import React, { Component } from 'react';
import GoogleAuth from './services/GoogleAuth';
import NavBar from './components/NavBar';
import TodoList from './components/TodoList';

class App extends Component {
    state = {
        isSignedIn: false,
        currentUser: null,
    }

    googleAuthInstance = null;

    constructor(props) {
        super(props);

        this.initGoogleAuth();
    }

    updateAuthStatus(signInStatus) {
        const userData = signInStatus ? this.googleAuthInstance.getUserData() : null;
        this.setState({
            isSignedIn: signInStatus,
            currentUser: userData.name
        });
    }

    initGoogleAuth() {
        this.googleAuthInstance = new GoogleAuth();
        this.googleAuthInstance.init(this.updateAuthStatus.bind(this));
    }

    render() {

        return (
            <div>
                <NavBar 
                    isSignedIn={this.state.isSignedIn} 
                    currentUser={this.state.currentUser}
                    onLogin={this.googleAuthInstance.signIn.bind(this.googleAuthInstance)}
                    onLogout={this.googleAuthInstance.signOut.bind(this.googleAuthInstance)}
                />
                { this.state.isSignedIn 
                    ? <TodoList /> 
                    : <h1 style={{textAlign: 'center', padding: '30px'}}>Please sign in</h1>
                }
            </div>
        );
    }
}

export default App;
