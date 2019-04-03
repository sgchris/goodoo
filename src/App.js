import React, { Component } from 'react';
import GoogleAuth from './services/GoogleAuth';
import NavBar from './components/NavBar';
import TodoList from './components/TodoList';

class App extends Component {
    state = {
        // initial google auth status check
        authChecked: false,

        // signed in (or not) user
        isSignedIn: false,

        // full name of the user
        currentUser: null,
        currentUserImage: null,
    }

    googleAuthInstance = null;

    constructor(props) {
        super(props);

        this.initGoogleAuth();
    }

    updateAuthStatus(signInStatus) {
        // first time in the function
        if (!this.state.authChecked) {
            this.setState({authChecked: true});
        }

        const userData = signInStatus ? this.googleAuthInstance.getUserData() : null;
        console.log('userData', userData);
        this.setState({
            isSignedIn: signInStatus,
            currentUser: userData ? userData.name : '',
            currentUserImage: userData ? userData.imageUrl : ''
        });
    }

    initGoogleAuth() {
        this.googleAuthInstance = new GoogleAuth();
        this.googleAuthInstance.init(this.updateAuthStatus.bind(this));
    }

    render() {

        return this.state.authChecked ? (
            <div>
                <NavBar 
                    isSignedIn={this.state.isSignedIn} 
                    currentUser={this.state.currentUser}
                    currentUserImage={this.state.currentUserImage}
                    onLogin={this.googleAuthInstance.signIn.bind(this.googleAuthInstance)}
                    onLogout={this.googleAuthInstance.signOut.bind(this.googleAuthInstance)}
                />
                { this.state.isSignedIn 
                    ? <TodoList /> 
                    : <h1 style={{textAlign: 'center', padding: '30px'}}>Please sign in</h1>
                }
            </div>
        ) : (
            <div><h1 style={{textAlign: 'center', padding: '30px' }}>Loading...</h1></div>
        )
    }
}

export default App;
