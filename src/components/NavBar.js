import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

class NavBar extends Component {

    render() {

        let {
            isSignedIn, 
            currentUser,
            currentUserImage,
            onLogin, 
            onLogout
        } = this.props;

        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="title" color="inherit" style={{flexGrow: 1}}>
                            GooDoo tasks manager
                        </Typography>
                        {isSignedIn
                            ? <Button color="inherit" title={'Logged in as ' + currentUser + '. Click to sign out'} onClick={onLogout}>
                                    <Avatar alt="Remy Sharp" src={currentUserImage} style={{margin: 'auto 10px'}}
                                     />
                                    {currentUser}
                                </Button>
                            : (
                                <Button color="inherit" onClick={onLogin}>
                                    {/*<AccountCircleIcon style={{marginRight: '10px'}} /> Sign in*/}
                                    <img src={process.env.PUBLIC_URL + '/google_logo.svg.png'} style={{height: '24px', width: '24px', marginRight: '10px'}} /> Sign in
                                </Button>
                            )
                        }
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

export default NavBar;