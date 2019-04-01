import React, { Component } from 'react'
import { AuthConsumer } from './../services/Auth';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import WorkIcon from '@material-ui/icons/Work';

const API_KEY = 'AIzaSyBHW8c_z5Q2DgA8vdP7fA8XI7LlgsvDiMY';
const CLIENT_ID = '710244711285-m1ioc2b9c3aoi9n0v69jacf5aaoct0l0.apps.googleusercontent.com';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest"];
const SCOPES = "https://www.googleapis.com/auth/tasks";
// const CLIENT_SECRET = 'AL7LY7OOPfa225aEUwoILuxx';

class TodoList extends Component {

    state = {
        folders: [],
        tasks: [],
    };

    componentDidMount() {
        // get list of tasks folders
        this.waitForGoogleApi(this.getFolders);
    }
     
    async waitForGoogleApi(callbackFn) {
        let that = this;
        // check if the script already loaded
        if (typeof(window.gapi) == 'undefined') {
            setTimeout(() => {
                console.log('waiting for google api script');
                that.waitForGoogleApi(callbackFn);
            }, 500);
        } else { 
            const bindCallbackFn = callbackFn.bind(this);
            bindCallbackFn();
        }
    }

    updateSigninStatus(a) {
        console.log('a', a);
    }

    // get tasks folders from google
    async getFolders() {
        window.gapi.load('client:auth2', () => {
            window.gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES
            }).then(() => {
                console.log('google init success');

                // Listen for sign-in state changes.
                window.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
                
                // Handle the initial sign-in state.
                this.updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
                /*
                authorizeButton.onclick = handleAuthClick;
                signoutButton.onclick = handleSignoutClick;
                */
            }, error => {
                console.log('google init error', error);
                //appendPre(JSON.stringify(error, null, 2));
            });
        });
    }

    onSearchInputChange = (event) => {
        // console.log("Search changed ..." + event.target.value)
        // if (event.target.value) {
        //     this.setState({searchString: event.target.value})
        // } else {
        //     this.setState({searchString: ''})
        // }
        // this.getCourses()
    }

    render() {
        return (
            <AuthConsumer>{
                authObj => {
                    return <div>
                        <TextField style={{padding: 24}}
                            id="searchInput"
                            placeholder="Search for tasks"   
                            margin="normal"
                            onChange={this.onSearchInputChange}
                            />
                        <Grid container spacing={24} style={{padding: 24}}>
                            <List>
                                <ListItem key="000">{authObj.authName}</ListItem>
                            { this.state.folders.map(folder => (
                                <ListItem key={folder.id}>
                                    <Avatar>
                                        <WorkIcon />
                                    </Avatar>
                                    <ListItemText primary={folder.name} secondary={ 'ID ' + folder.id } />
                                </ListItem>
                            ))}
                            </List>
                        </Grid>
                    </div>
                }
            }
            </AuthConsumer>
        )
    }
}
export default TodoList;