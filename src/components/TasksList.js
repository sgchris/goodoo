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
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import indigo from '@material-ui/core/colors/indigo';
import red from '@material-ui/core/colors/red';

class TasksList extends Component {
    render() {
        return (
            <div>  
                <List>
                { this.props.tasks.map(task => (
                    <ListItem button key={task.id}>
                        {/*<Avatar style={{background: indigo[500]}}><AssignmentIcon /></Avatar>*/}
                        <ListItemSecondaryAction>
                            <IconButton aria-label="Delete" onClick={this.props.onTaskDelete}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                        <IconButton title="Mark the task as complete" onClick={this.props.onTaskComplete}>
                            <Avatar style={{background: indigo[500]}}><DoneIcon /></Avatar>
                        </IconButton>
                        <ListItemText primary={task.title} secondary={ 'Last updated at ' + task.updated } />
                    </ListItem>
                ))}
                </List>
            </div>
        )
    }
}

export default TasksList;