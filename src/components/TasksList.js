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

class TasksList extends Component {

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