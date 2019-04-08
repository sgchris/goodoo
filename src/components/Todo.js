import React, { Component } from 'react'

import Grid from '@material-ui/core/Grid';
import TasksList from './TasksList';
import FoldersList from './FoldersList';
import AddTaskDialog from './../dialogs/AddTaskDialog';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import WorkIcon from '@material-ui/icons/Work';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

class Todo extends Component {

    state = {
        selectedFolder: null,
        folders: [],
        tasks: [],
        showCompleted: false,
        showAddTaskDialog: false,
    };

    constructor(props) {
        super(props);

        this.onTaskCreate=this.onTaskCreate.bind(this);
        this.markTaskComplete=this.markTaskComplete.bind(this);
        this.onTaskDelete=this.onTaskDelete.bind(this);

        this.folderClick = this.folderClick.bind(this);
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
        });
    }

    getTasks() {
        // check that a folder is selected
        if (!this.state.selectedFolder) {
            return false;
        }

        window.gapi.client.tasks.tasks.list({
            tasklist: this.state.selectedFolder.id,
            showCompleted: this.state.showCompleted
        }).then(response => {
            if (response.status === 200 && response.result.items) {
                this.setState({tasks:response.result.items});
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

    onAddTaskButtonClicked = (event) => {
        this.setState({showAddTaskDialog: true})
    }

    onTaskCreate(newTaskData) {
        // hide the dialog
        this.setState({showAddTaskDialog: false})

        // generate new resource
        const resource = {
            title: newTaskData.title,
            statue: "needsAction"
        };

        if (newTaskData.addRemider) {
            resource.due = newTaskData.date;
        }

        window.gapi.client.tasks.tasks.insert({
            tasklist: this.state.selectedFolder.id,
            resource
        }).then(
            response => this.getTasks(), 
            err => console.error("Execute error", err)
        );
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
        if (!clickedTaskData || !clickedTaskData.id) {
            return false;
        }

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
                <AddTaskDialog open={this.state.showAddTaskDialog} 
                    folderName={this.state.selectedFolder ? this.state.selectedFolder.title : ''}
                    callback={this.onTaskCreate}
                    onClose={() => console.log('on close')}
                />
                <Grid container spacing={24}>
                    <Grid item xs={12} md={3}>
                        <Typography variant="title" color="inherit" style={{padding: '30px' }}>
                            Tasks lists 
                            <Fab size="small" color="secondary" 
                                style={{marginLeft: '10px'}}
                                aria-label="Add" 
                                title="Add folder" 
                            >
                                <AddIcon />
                            </Fab>
                        </Typography>
                        <FoldersList folders={this.state.folders} 
                            selectedFolderId={this.state.selectedFolder ? this.state.selectedFolder.id : null} 
                            folderClick={this.folderClick} 
                        />
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
                                <Fab size="small" color="secondary" 
                                    style={{marginLeft: '10px'}}
                                    aria-label="Add" 
                                    title="Add task"
                                    onClick={this.onAddTaskButtonClicked}
                                >
                                    <AddIcon />
                                </Fab>
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