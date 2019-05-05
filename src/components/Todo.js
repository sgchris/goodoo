import React, { Component } from 'react'

import Grid from '@material-ui/core/Grid';
import TasksList from './TasksList';
import FoldersList from './FoldersList';
import TaskDialogService from './../dialogs/TaskDialogService';
import FolderDialogService from './../dialogs/FolderDialogService';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import axios from 'axios';

import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class Todo extends Component {
    
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    state = {
        selectedFolder: null,
        
        folders: [],
        tasks: [],
        
        // show completed tasks switch
        showCompleted: false,  
    };

    constructor(props) {
        super(props);

        this.cookies = props.cookies;


        this.state.showCompleted = this.cookies.get('showCompleted') == '1' || false;

        this.taskUpdate=this.taskUpdate.bind(this);
        this.onMarkTaskComplete=this.onMarkTaskComplete.bind(this);
        this.onTaskDelete=this.onTaskDelete.bind(this);
        
        this.onFolderClick = this.onFolderClick.bind(this);
        this.folderUpdate = this.folderUpdate.bind(this);

        this.folderCreate = this.folderCreate.bind(this);
        this.onFolderDelete = this.onFolderDelete.bind(this);
    }

    componentDidMount() {
        // get list of tasks folders
        this.getFolders();
    }

    onFolderClick(clickedFolderData) {
        if (clickedFolderData) {
            this.setState(
                {selectedFolder: clickedFolderData}, 
                () => this.getTasks()
            );
        }
    }

    // get tasks folders from google
    getFolders() {
        let that = this;
        window.gapi.client.tasks.tasklists.list({
            'maxResults': 100
        }).then((response) => {
            if (response && response.status === 200) {
                let foundSelectedFolder = false;
                let foldersList = response.result.items.map(
                    item => {
                        // check if the currently selected folder is still in the list
                        if (that.state.selectedFolder && that.state.selectedFolder.id === item.id) {
                            foundSelectedFolder = true;
                        }

                        return {
                            id: item.id,
                            title: item.title,
                            updated: item.updated
                        }
                    }
                );

                that.setState({
                    folders: foldersList
                });

                if ((!that.state.selectedFolder || !foundSelectedFolder) && foldersList && foldersList.length > 0) {
                    let selectedFolder = foldersList[0];
                    that.setState({
                        selectedFolder
                    }, () => {
                        that.getTasks();
                    });
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
            if (response.status === 200) {
                this.setState({
                    tasks: (response.result.items && response.result.items.length > 0) ? 
                        response.result.items : []
                });
            }
        })
    }

    taskCreate(newTaskData) {

        // generate new resource
        const resource = Object.assign({}, {status: "needsAction"}, newTaskData);

        window.gapi.client.tasks.tasks.insert({
            tasklist: this.state.selectedFolder.id,
            resource
        }).then(
            response => this.getTasks(), 
            err => console.error("Execute error", err)
        );
    }

    /**
     * Create new folder
     * @param {String} title 
     */
    folderCreate(title) {
        // generate new resource
        const resource = {
            title
        };

        window.gapi.client.tasks.tasklists.insert({
            resource
        }).then(
            response => this.getFolders(), 
            err => console.error("Execute error", err)
        );
    }

    /**
     * Update this function to send requests manually
     * 
     * The "due" time is always set to 00:00:00. A bug is open:
     * https://issuetracker.google.com/issues/131802538
     */
    taskUpdate(taskData) {
        const url = 'https://www.googleapis.com/tasks/v1/' + 
            'lists/' + this.state.selectedFolder.id + '/tasks/' + taskData.id;
        const accessToken = window.gapi.auth2.getAuthInstance().isSignedIn.get() ? 
            window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token : 
            null;
        taskData.due=(new Date()).toISOString();
        axios.put(url, taskData, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }).then(
            response => this.getTasks(), 
            err => console.error("Execute error", err)
        );
        /*
        window.gapi.client.tasks.tasks.update({
            tasklist: this.state.selectedFolder.id,
            task: taskData.id, 
            resource: taskData
        }).then(
            response => this.getTasks(), 
            err => console.error("Execute error", err)
        );
        */
    }

    folderUpdate(folderData, folderNewTitle) {

        // get the original folder object
        const resource = Object.assign({}, folderData);
        resource.title = folderNewTitle;
        
        window.gapi.client.tasks.tasklists.update({
            tasklist: folderData.id,
            resource
        }).then(
            response => this.getFolders(), 
            err => console.error("Execute error", err)
        );
    }

    onMarkTaskComplete(taskData, markAsNotComplete) {

        if (!taskData || !taskData.id) {
            return false;
        }

        // update the task object
        if (markAsNotComplete) { // check if the opposite action required
            taskData.status = "needsAction";
            if ("completed" in taskData) {
                delete taskData.completed;
            }
        } else {
            taskData.status = "completed";
            taskData.completed = new Date();
        }
        
        window.gapi.client.tasks.tasks.update({
            task: taskData.id,
            tasklist: this.state.selectedFolder.id,
            resource: taskData
        }).then(
            response => this.getTasks(), 
            err => console.error("Execute error", err)
        );
    }

    onTaskDelete(taskData) {
        if (!taskData || !taskData.id) {
            return false;
        }

        window.gapi.client.tasks.tasks.delete({
            task: taskData.id,
            tasklist: this.state.selectedFolder.id,
        }).then(
            response => this.getTasks(), 
            err => console.error("Execute error", err)
        );
    }

    onFolderDelete(folderData) {
        if (!folderData || !folderData.id) {
            return false;
        }

        window.gapi.client.tasks.tasklists.delete({
            tasklist: folderData.id,
        }).then(
            response => this.getFolders(), 
            err => console.error("Execute error", err)
        );
    }

    // callback for the "show completed" switch
    onShowCompleted(showCompleted) {
        if (showCompleted) {
            this.cookies.set('showCompleted', '1');
        } else {
            this.cookies.remove('showCompleted');
        }

        this.setState(
            {showCompleted},
            () => this.getTasks()
        );
        
    }

    render() {
        return (
            <div>
                { /* Folder Dialog (create/edit) */}
                <Grid container spacing={24}>
                    <Grid item xs={12} md={3}>
                        <Typography variant="title" color="inherit" style={{padding: '30px' }}>
                            Folders 
                            <FolderDialogService>{
                                openFolderDialog => {
                                    return (
                                        <Fab size="small" color="secondary" 
                                            style={{marginLeft: '10px'}}
                                            aria-label="Add" 
                                            title="Add folder" 
                                            onClick={event => {
                                                openFolderDialog(
                                                    null, 
                                                    newFolderName => this.folderCreate(newFolderName)
                                                )
                                            }}
                                        >
                                            <AddIcon />
                                        </Fab>
                                    )
                                }
                            }</FolderDialogService>
                            
                        </Typography>
                        <FolderDialogService>{
                            openFolderDialog => {
                                return (
                                    <FoldersList folders={this.state.folders} 
                                        selectedFolderId={this.state.selectedFolder ? this.state.selectedFolder.id : null} 
                                        onFolderClick={this.onFolderClick} 
                                        onFolderDelete={this.onFolderDelete} 
                                        onFolderRename={folderData => {
                                            openFolderDialog(folderData.title, folderNewTitle => this.folderUpdate(folderData, folderNewTitle))
                                        }} 
                                        folderDelete={this.folderDelete} 
                                    />
                                );
                            }
                        }</FolderDialogService>
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
                                <TaskDialogService>
                                {openTaskDialog => {
                                    return (
                                        <Fab size="small" color="secondary" 
                                            style={{marginLeft: '10px'}}
                                            aria-label="Add" 
                                            title="Add task"
                                            onClick={
                                                event => {
                                                    const selectedFolderName = this.state.selectedFolder ? 
                                                        this.state.selectedFolder.title : '';
                                                    openTaskDialog(
                                                        selectedFolderName, 
                                                        false, // title
                                                        false, // due
                                                        (title, due) => {
                                                            let newTaskData = { title };
                                                            if (due) {
                                                                newTaskData.due = due;
                                                            }
                                                            
                                                            this.taskCreate(newTaskData);
                                                        }
                                                    );
                                                }
                                            }
                                        >
                                            <AddIcon />
                                        </Fab>
                                    );
                                }}
                                </TaskDialogService>
                            </Typography>
                            <TaskDialogService>
                                {openTaskDialog => {
                                    return (
                                        <TasksList 
                                            tasks={this.state.tasks} 
                                            onTaskClick={ 
                                                clickedTaskData => {
                                                    const selectedFolderName = this.state.selectedFolder ? 
                                                        this.state.selectedFolder.title : '';

                                                    openTaskDialog(
                                                        selectedFolderName, 
                                                        clickedTaskData.title, 
                                                        clickedTaskData.due,

                                                        // on "update" clicked
                                                        (title, due) => {
                                                            clickedTaskData.title = title;
                                                            clickedTaskData.due = due;
                                                            if (!clickedTaskData.due) {
                                                                delete clickedTaskData.due;
                                                            }

                                                            this.taskUpdate(clickedTaskData);
                                                        }
                                                    );
                                                }
                                            }
                                            onMarkTaskComplete={this.onMarkTaskComplete}
                                            onTaskDelete={this.onTaskDelete}
                                        />
                                    )
                                }}
                            </TaskDialogService>
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
export default withCookies(Todo);