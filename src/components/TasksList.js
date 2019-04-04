import React, { Component } from 'react'

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import WorkIcon from '@material-ui/icons/Work';
import Typography from '@material-ui/core/Typography';

class Tasks extends Component {

    state = {
        tasks: [],
    };

    componentDidMount() {
        // get list of tasks folders
        this.getFolders();
    }

    constructor(props) {
        super(props);

        this.props = props;

        // set initial tasks from props
        const { tasks, onNewTask } = props;
        if (tasks && tasks.length > 0) {
            this.setState({
                tasks
            });
        }
    }

    tasksListItemClick(event, clickedFolderData) {
        if (clickedFolderData) {
            this.setState({selectedFolder: clickedFolderData});
        }
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
                                onClick={event => this.tasksListItemClick(event, folder)}
                            >
                                <Avatar><WorkIcon /></Avatar>
                                <ListItemText primary={folder.title} secondary={ 'Last updated at ' + folder.updated } />
                            </ListItem>
                        ))}
                        </List>
                    </Grid>
                    { this.state.selectedFolder ? (
                        <Grid item xs={12} md={9}>
                            <Typography variant="title" color="inherit">
                                {this.state.selectedFolder.title}
                            </Typography>

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