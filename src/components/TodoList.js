import React, { Component } from 'react'

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import WorkIcon from '@material-ui/icons/Work';
import Typography from '@material-ui/core/Typography';

class TodoList extends Component {

    state = {
        selectedFolder: null,
        folders: [],
        tasks: [],
    };

    componentDidMount() {
        // get list of tasks folders
        this.getFolders();
    }

    // get tasks folders from google
    getFolders() {
        let that = this;
        window.gapi.client.tasks.tasklists.list({
            'maxResults': 50
        }).then((response) => {
            if (response && response.status === 200) {
                let foldersList = response.result.items.map(
                    item => ({
                        id: item.id,
                        title: item.title,
                        updated: item.updated
                    })
                );
                that.setState({
                    folders: foldersList
                });

                if (foldersList && foldersList.length > 0) {
                    that.setState({
                        selectedFolder: foldersList[0]
                    });
                }
            }
            console.log('response', response);
        });
    }

    onNewTaskInputChange = (event) => {
        // console.log("Search changed ..." + event.target.value)
        // if (event.target.value) {
        //     this.setState({searchString: event.target.value})
        // } else {
        //     this.setState({searchString: ''})
        // }
        // this.getCourses()
    }

    tasksListItemClick(event, id) {
        console.log('tasks list id', id);
    }

    render() {
        return (
            <div>
                <Grid container spacing={24}>
                    <Grid item xs={12} md={3}>
                        <Typography variant="title" color="inherit" style={{textAlign: 'center', padding: '30px' }}>
                            Tasks lists
                        </Typography>
                        <List>
                        { this.state.folders.map(folder => (
                            <ListItem button key={folder.id} 
                                selected={this.state.selectedFolder && this.state.selectedFolder.id === folder.id}
                                onClick={event => this.tasksListItemClick(folder.id)}
                            >
                                <Avatar>
                                    <WorkIcon />
                                </Avatar>
                                <ListItemText primary={folder.title} secondary={ 'Last updated at ' + folder.updated } />
                            </ListItem>
                        ))}
                        </List>
                    </Grid>
                    { this.state.selectedFolder ? (
                        <Grid item xs={12} md={9}>
                            {this.state.selectedFolder.title}

                            <TextField style={{padding: 24}}
                                id="newTaskInput"
                                placeholder="New task"   
                                margin="normal"
                                onChange={this.onNewTaskInputChange}
                                />

                        </Grid>
                    ) : (
                        <Grid item xs={12} md={9}>No tasks list selected</Grid>
                    )
                    }
                </Grid>
            </div>
        )
    }
}
export default TodoList;