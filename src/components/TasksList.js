import React, { Component } from 'react'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DoneIcon from '@material-ui/icons/Done';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import indigo from '@material-ui/core/colors/indigo';
import {formatRelative} from 'date-fns';
import { Typography } from '@material-ui/core';

import red from '@material-ui/core/colors/red';

class TasksList extends Component {

    getTaskSecondRow(task) {
        if (task.status === 'completed') {
            return 'Completed at ' + formatRelative(new Date(task.completed), new Date());
        } else if (task.due) {
            if ((new Date(task.due)) > (new Date())) {
                // future
                return <span style={{color: indigo[500]}}>Reminder at {formatRelative(new Date(task.due), new Date())}</span>
            } else {
                // past
                return <span style={{color: red[500]}}>Missed reminder {formatRelative(new Date(task.due), new Date())}</span>
            }
        } else {
            return 'Updated at ' + formatRelative(new Date(task.updated), new Date())
        }
    }

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
                        <ListItemText primary={
                            <React.Fragment>
                                { task.status === "completed" ? <strike>{task.title}</strike> : task.title}
                            </React.Fragment>
                        } secondary={
                            <React.Fragment>
                                {this.getTaskSecondRow(task)}
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