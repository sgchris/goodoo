import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
//import SearchIcon from '@material-ui/core/SearchIcon'
import InputBase from '@material-ui/core/InputBase'

const NavBar = () => {
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="title" color="inherit">
                        GooDoo tasks manager
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default NavBar;