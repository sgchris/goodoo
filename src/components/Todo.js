import React, { Component } from 'react'

import Grid from '@material-ui/core/Grid';
import TasksList from './TasksList';
import FoldersList from './FoldersList';
// import TaskDialog, { DIALOG_TYPES as TASK_DIALOG_TYPES } from './../dialogs/TaskDialog';
import TaskDialogService, { DIALOG_TYPES as TASK_DIALOG_TYPES } from './../dialogs/TaskDialogService';
import FolderDialog, { DIALOG_TYPES as FOLDER_DIALOG_TYPES} from './../dialogs/FolderDialog';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

class Todo extends Component {

    state = {
        selectedFolder: null,
        
        folders: [],
        tasks: [],
        
        // show completed tasks switch 
        // TODO: read from cookie
        showCompleted: false,
        
        // task dialog related
        showTaskDialog: false,
        selectedTask: null,
        taskDialogType: TASK_DIALOG_TYPES.DIALOG_TYPE_CREATE,

        // folder dialog related
        showFolderDialog: false,
        folderDialogType: FOLDER_DIALOG_TYPES.DIALOG_TYPE_CREATE,
        clickedFolder: null,
    };

    constructor(props) {
        super(props);

        this.onTaskClick=this.onTaskClick.bind(this);
        this.taskUpdate=this.taskUpdate.bind(this);
        this.onMarkTaskComplete=this.onMarkTaskComplete.bind(this);
        this.onTaskDelete=this.onTaskDelete.bind(this);
        
        this.onFolderClick = this.onFolderClick.bind(this);
        this.onFolderRenameClick = this.onFolderRenameClick.bind(this);
        this.folderUpdate = this.folderUpdate.bind(this);

        this.onFolderCreate = this.onFolderCreate.bind(this);
        this.onFolderDelete = this.onFolderDelete.bind(this);

        this.onDialogClose = this.onDialogClose.bind(this);
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

    onAddFolderButtonClicked = (event) => {
        this.setState({
            folderDialogType: FOLDER_DIALOG_TYPES.DIALOG_TYPE_CREATE,
            showFolderDialog: true
        })
    }

    onTaskClick(clickedTaskData) {
        console.log('onTaskClick', {clickedTaskData});
        // find the selected task
        let selectedTask = this.state.tasks.reduce((prevTask, currentTask) => {
            return (currentTask.id === clickedTaskData.id) ? currentTask : prevTask;
        });
        
        let that = this;
        this.setState({
            selectedTask
        }, () => {
            that.setState({
                taskDialogType: TASK_DIALOG_TYPES.DIALOG_TYPE_EDIT,
            }, () => {
                that.setState({
                    showTaskDialog: true
                });
            });
        })
    }

    // show the rename dialog
    onFolderRenameClick(folderData) {
        // find the selected task
        let clickedFolder = this.state.folders.reduce((prevFolder, currentFolder) => {
            return (currentFolder.id === folderData.id) ? currentFolder : prevFolder;
        });
        
        let that = this;
        this.setState({
            clickedFolder
        }, () => {
            that.setState({
                folderDialogType: FOLDER_DIALOG_TYPES.DIALOG_TYPE_EDIT,
            }, () => {
                that.setState({
                    showFolderDialog: true
                });
            });
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

    onFolderCreate(newFolderData) {
        // hide the dialog
        this.setState({showFolderDialog: false})

        // generate new resource
        const resource = {
            title: newFolderData.title
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
     */
    taskUpdate(taskData) {
        window.gapi.client.tasks.tasks.update({
            tasklist: this.state.selectedFolder.id,
            task: taskData.id, 
            resource: taskData
        }).then(
            response => this.getTasks(), 
            err => console.error("Execute error", err)
        );
    }

    folderUpdate(folderData) {
        // hide the dialog
        this.setState({showFolderDialog: false});

        // get the original folder object
        const resource = Object.assign({}, this.state.clickedFolder);
        resource.title = folderData.title;
        
        window.gapi.client.tasks.tasklists.update({
            tasklist: this.state.clickedFolder.id,
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
        this.setState(
            {showCompleted},
            () => this.getTasks()
        );
    }

    onDialogClose = () => this.setState({
        showTaskDialog: false,
        showFolderDialog: false,
    });

    render() {
        return (
            <div>
                { /* Task Dialog (create/edit) */}
                {/* 
                { this.state.taskDialogType === TASK_DIALOG_TYPES.DIALOG_TYPE_CREATE ? (
                    <TaskDialog open={this.state.showTaskDialog} 
                        folderName={this.state.selectedFolder ? this.state.selectedFolder.title : ''}
                        callback={this.onTaskCreate}
                        onClose={this.onDialogClose}
                    />
                ) : (
                    <TaskDialog open={this.state.showTaskDialog} 
                        taskId={this.state.selectedTask ? this.state.selectedTask.id : ''}
                        title={this.state.selectedTask ? this.state.selectedTask.title : ''}
                        date={this.state.selectedTask ? this.state.selectedTask.due : ''}
                        addRemider={this.state.selectedTask ? (!!this.state.selectedTask.due) : false}
                        
                        folderName={this.state.selectedFolder ? this.state.selectedFolder.title : ''}
                        callback={this.taskUpdate}
                        onClose={this.onDialogClose}
                    />
                )}
                */}

                { /* Folder Dialog (create/edit) */}
                { this.state.folderDialogType === FOLDER_DIALOG_TYPES.DIALOG_TYPE_CREATE ? (
                    <FolderDialog open={this.state.showFolderDialog} 
                        callback={this.onFolderCreate}
                        onClose={this.onDialogClose}
                    />
                ) : (
                    <FolderDialog open={this.state.showFolderDialog} 
                        title={this.state.clickedFolder ? this.state.clickedFolder.title : ''}
                        callback={this.folderUpdate}
                        onClose={this.onDialogClose}
                    />
                )}
                <Grid container spacing={24}>
                    <Grid item xs={12} md={3}>
                        <Typography variant="title" color="inherit" style={{padding: '30px' }}>
                            Folders 
                            <Fab size="small" color="secondary" 
                                style={{marginLeft: '10px'}}
                                aria-label="Add" 
                                title="Add folder" 
                                onClick={this.onAddFolderButtonClicked}
                            >
                                <AddIcon />
                            </Fab>
                        </Typography>
                        <FoldersList folders={this.state.folders} 
                            selectedFolderId={this.state.selectedFolder ? this.state.selectedFolder.id : null} 
                            onFolderClick={this.onFolderClick} 
                            onFolderDelete={this.onFolderDelete} 
                            onFolderRename={this.onFolderRenameClick} 
                            folderDelete={this.folderDelete} 
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
export default Todo;