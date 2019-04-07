import React, { Component } from 'react'

import Grid from '@material-ui/core/Grid';
import TasksList from './TasksList';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import WorkIcon from '@material-ui/icons/Work';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';

class Todo extends Component {

    state = {
        selectedFolder: null,
        folders: [],
        tasks: [],
        showCompleted: false,
    };

    constructor(props) {
        super(props);

        this.onTaskCreate=this.onTaskCreate.bind(this);
        this.markTaskComplete=this.markTaskComplete.bind(this);
        this.onTaskDelete=this.onTaskDelete.bind(this);
    }

    componentDidMount() {
        // get list of tasks folders
        this.getFolders();
    }

    // get tasks folders from google
    getFolders() {
        let that = this;
        window.gapi.client.tasks.tasklists.list({
            'maxResults': 100
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
                    let selectedFolder = foldersList[0];
                    that.setState({
                        selectedFolder
                    });

                    that.getTasks();
                }
            }
            console.log('response', response);
        });
    }

    getTasks() {
        // check that a folder is selected
        if (!this.state.selectedFolder) {
            return false;
        }

        console.log('getTasks: this.state.showCompleted', this.state.showCompleted)

        window.gapi.client.tasks.tasks.list({
            tasklist: this.state.selectedFolder.id,
            showCompleted: this.state.showCompleted
        }).then(response => {
            if (response.status === 200 && response.result.items) {
                let tasks = response.result.items.map(taskItem => ({
                    id: taskItem.id,
                    due: taskItem.due,
                    title: taskItem.title,
                    updated: (new Date(taskItem.updated)).toDateString()
                }));
                tasks = response.result.items;
                console.log('todo::getTasks. tasks', tasks);
                this.setState({tasks});
            }
        })
    }

    folderClick(event, clickedFolderData) {
        if (clickedFolderData) {
            this.setState(
                {selectedFolder: clickedFolderData}, 
                () => this.getTasks()
            );
        }
    }

    onTaskCreate(_, newTaskData) {
        console.log('onTaskCreate', newTaskData);
    }

    markTaskComplete(_, clickedTaskData, markAsNotComplete) {
        if (!clickedTaskData || !clickedTaskData.id) {
            return false;
        }

        // update the task object
        if (markAsNotComplete) { // check if the opposite action required
            clickedTaskData.status = "needsAction";
            if ("completed" in clickedTaskData) {
                delete clickedTaskData.completed;
            }
        } else {
            clickedTaskData.status = "completed";
            clickedTaskData.completed = new Date();
        }
        console.log('clickedTaskData', clickedTaskData);
        window.gapi.client.tasks.tasks.update({
            task: clickedTaskData.id,
            tasklist: this.state.selectedFolder.id,
            resource: clickedTaskData
        }).then(
            response => this.getTasks(), 
            err => console.error("Execute error", err)
        );
    }

    onTaskDelete(_, clickedTaskData) {
        console.log('on delete', clickedTaskData);
        if (!clickedTaskData || !clickedTaskData.id) {
            return false;
        }

        console.log('calling delete api');
        window.gapi.client.tasks.tasks.delete({
            task: clickedTaskData.id,
            tasklist: this.state.selectedFolder.id,
        }).then(
            response => this.getTasks(), 
            err => console.error("Execute error", err)
        );
    }

    // callback for the "show completed" switch
    onShowCompleted(showCompleted) {
        console.log('showCompleted', showCompleted);
        this.setState(
            {showCompleted},
            () => this.getTasks()
        );
    }

    render() {
        return (
            <div>
                <Grid container spacing={24}>
                    <Grid item xs={12} md={3}>
                        <Typography variant="title" color="inherit" style={{padding: '30px' }}>
                            Tasks lists
                        </Typography>
                        <List>
                        { this.state.folders.map(folder => (
                            <ListItem button key={folder.id} 
                                selected={this.state.selectedFolder && this.state.selectedFolder.id === folder.id}
                                onClick={event => this.folderClick(event, folder)}
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
                            <div style={{float: 'right', padding: '18px'}}>
                                <Typography>Show completed <Switch color="primary" checked={this.state.showCompleted}
                                    onChange={event => this.onShowCompleted(event.target.checked)} />
                                </Typography>
                            </div>
                            <Typography variant="title" color="inherit" style={{padding: '30px' }}>
                                Folder: {this.state.selectedFolder.title}
                            </Typography>

                            <TasksList tasks={this.state.tasks} 
                                onTaskCreate={this.onTaskCreate}
                                markTaskComplete={this.markTaskComplete}
                                onTaskDelete={this.onTaskDelete}
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
export default Todo;