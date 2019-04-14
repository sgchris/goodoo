import React, { Component } from 'react'

import Grid from '@material-ui/core/Grid';
import TasksList from './TasksList';
import FoldersList from './FoldersList';
import TaskDialog, { DIALOG_TYPES } from './../dialogs/TaskDialog';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

class Todo extends Component {

    state = {
        dialogType: DIALOG_TYPES.DIALOG_TYPE_CREATE,
        selectedFolder: null,
        selectedTask: null,
        folders: [],
        tasks: [],
        showCompleted: false,
        showTaskDialog: false,
    };

    constructor(props) {
        super(props);

        this.onTaskClick=this.onTaskClick.bind(this);
        this.taskUpdate=this.taskUpdate.bind(this);
        this.onTaskCreate=this.onTaskCreate.bind(this);
        this.onMarkTaskComplete=this.onMarkTaskComplete.bind(this);
        this.onTaskDelete=this.onTaskDelete.bind(this);
        this.folderClick = this.folderClick.bind(this);
        this.onTaskDialogClose = this.onTaskDialogClose.bind(this);
    }

    componentDidMount() {
        // get list of tasks folders
        this.getFolders();
    }

    folderClick(event, clickedFolderData) {
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

    onAddTaskButtonClicked = (event) => {
        this.setState({
            dialogType: DIALOG_TYPES.DIALOG_TYPE_CREATE,
            showTaskDialog: true
        })
    }

    onTaskClick(clickedTaskData) {
        // find the selected task
        let selectedTask = this.state.tasks.reduce((prevTask, currentTask) => {
            return (currentTask.id === clickedTaskData.id) ? currentTask : prevTask;
        });
        
        let that = this;
        console.log('selectedTask', selectedTask);
        this.setState({
            selectedTask
        }, () => {
            that.setState({
                dialogType: DIALOG_TYPES.DIALOG_TYPE_EDIT,
            }, () => {
                that.setState({
                    showTaskDialog: true
                });
            });
        })
    }

    onTaskCreate(newTaskData) {
        // hide the dialog
        this.setState({showTaskDialog: false})

        // generate new resource
        const resource = {
            title: newTaskData.title,
            status: "needsAction"
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

    taskUpdate(taskData) {
        // hide the dialog
        this.setState({showTaskDialog: false});

        // get the original task object
        const resource = Object.assign({}, this.state.selectedTask);
        resource.title = taskData.title;
        resource.status = "needsAction";
        if (taskData.addRemider) {
            resource.due = taskData.date;
        } else {
            if ('due' in resource) {
                delete resource.due;
            }
        }
        
        window.gapi.client.tasks.tasks.update({
            tasklist: this.state.selectedFolder.id,
            task: this.state.selectedTask.id, 
            resource
        }).then(
            response => this.getTasks(), 
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

    // callback for the "show completed" switch
    onShowCompleted(showCompleted) {
        this.setState(
            {showCompleted},
            () => this.getTasks()
        );
    }

    onTaskDialogClose = () => this.setState({showTaskDialog: false});

    render() {
        return (
            <div>
                { this.state.dialogType === DIALOG_TYPES.DIALOG_TYPE_CREATE ? (
                    <TaskDialog open={this.state.showTaskDialog} 
                        folderName={this.state.selectedFolder ? this.state.selectedFolder.title : ''}
                        callback={this.onTaskCreate}
                        onClose={this.onTaskDialogClose}
                    />
                ) : (
                    <TaskDialog open={this.state.showTaskDialog} 
                        taskId={this.state.selectedTask ? this.state.selectedTask.id : ''}
                        title={this.state.selectedTask ? this.state.selectedTask.title : ''}
                        date={this.state.selectedTask ? this.state.selectedTask.due : ''}
                        addRemider={this.state.selectedTask ? (!!this.state.selectedTask.due) : false}
                        
                        folderName={this.state.selectedFolder ? this.state.selectedFolder.title : ''}
                        callback={this.taskUpdate}
                        onClose={this.onTaskDialogClose}
                    />
                )}
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
                                onTaskClick={this.onTaskClick}
                                onTaskCreate={this.onTaskCreate}
                                onMarkTaskComplete={this.onMarkTaskComplete}
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