import React, { Component } from 'react'

import TextField from '@material-ui/core/TextField';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Icon from '@material-ui/core/Icon';
import WorkIcon from '@material-ui/icons/Work';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DoneIcon from '@material-ui/icons/Done';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import indigo from '@material-ui/core/colors/indigo';
import red from '@material-ui/core/colors/red';

class TasksList extends Component {

    // onTaskCreate(event, newTaskData) {
    //     this.props.onTaskCreate(newTaskData);
    // }

    // onTaskComplete(event, clickedTaskData) {
    //     this.props.onTaskComplete(clickedTaskData);
    // }

    // onTaskDelete(event, clickedTaskData) {
    //     this.props.onTaskDelete(clickedTaskData);
    // }

    render() {
        return (
            <div>  
                <List>
                { this.props.tasks.map(task => (
                    <ListItem button key={task.id}>
                        { task.status === "completed" ?  (
                            <IconButton title="Task completed. Click to mark as uncompleted"
                                onClick={event => this.props.markTaskComplete(event, task, 'mark as not completed')}>
                                <Avatar><DoneOutlineIcon /></Avatar>
                            </IconButton>
                        ) : (
                                <IconButton title="Mark complete" 
                                    onClick={event => this.props.markTaskComplete(event, task)}>
                                    <Avatar style={{background: indigo[500]}}><DoneIcon /></Avatar>
                                </IconButton>
                            )
                        }
                        {/*<ListItemText primary={task.title} secondary={ 'Last updated at ' + task.updated } />*/}
                        <ListItemText primary={
                            <React.Fragment>
                                { task.status === "completed" ? <strike>{task.title}</strike> : task.title}
                            </React.Fragment>
                        } secondary={
                            <React.Fragment>
                                {   
                                    task.status === "completed" ? 
                                    'Completed at ' + (new Date(task.completed)).toDateString() :  
                                    'Updated at ' + (new Date(task.updated)).toDateString()
                                }
                            </React.Fragment>
                        } />
                        <ListItemSecondaryAction>
                            <IconButton aria-label="Delete" onClick={event => this.props.onTaskDelete(event, task)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
                </List>
            </div>
        )
    }
}

export default TasksList;