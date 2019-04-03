import React, { Component } from 'react';
import GoogleAuth from './services/GoogleAuth';
import NavBar from './components/NavBar';
import TodoList from './components/TodoList';
import Button from '@material-ui/core/Button'

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography'

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
                    : <Typography variant="title" color="inherit" style={{textAlign: 'center', padding: '30px' }}>
                        Please <Button variant="contained" color="primary" onClick={this.googleAuthInstance.signIn.bind(this.googleAuthInstance)}>sign in</Button>
                    </Typography>
                }
            </div>
        ) : (
            <div>
                <Typography variant="title" color="inherit" style={{textAlign: 'center', padding: '30px' }}>
                    <CircularProgress  size={20} /> <br />
                    Awesome GooDoo app is Loading...
                </Typography>
            </div>
        )
    }
}

export default App;
