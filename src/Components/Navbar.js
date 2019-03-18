import React, {Component} from 'react';

class Navbar extends Component {
    render() {
        return (
            <nav className="blue-grey darken-3">
                <div className="nav-wrapper" style={{paddingLeft: '20px'}}>
                    <a href="/" className="brand-logo"><i className="medium material-icons">chrome_reader_mode</i> GooDoo 
                    &nbsp;<small>Todo using Google Tasks API</small>
                    </a>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li><a href="https://github.com/sgchris" target="_blank">GitHub</a></li>
                        <li><a href="https://developers.google.com/tasks/" target="_blank">Google Tasks API</a></li>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default Navbar;