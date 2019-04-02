import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
//import SearchIcon from '@material-ui/core/SearchIcon'
import InputBase from '@material-ui/core/InputBase'


class NavBar extends Component {

    render() {

        let {
            isSignedIn, 
            currentUser,
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
                            ? <Button color="inherit" onClick={onLogout}>Logout {currentUser}</Button>
                            : <Button color="inherit" onClick={onLogin}>Login</Button>
                        }
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

export default NavBar;