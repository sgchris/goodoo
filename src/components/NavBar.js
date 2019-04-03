import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
//import SearchIcon from '@material-ui/core/SearchIcon'
// import InputBase from '@material-ui/core/InputBase'
import Avatar from '@material-ui/core/Avatar'


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
                            : <Button color="inherit" onClick={onLogin}>Login</Button>
                        }
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

export default NavBar;