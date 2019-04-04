import React, { Component } from 'react'

import TextField from '@material-ui/core/TextField';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import WorkIcon from '@material-ui/icons/Work';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DoneIcon from '@material-ui/icons/Done';
import Typography from '@material-ui/core/Typography';
import indigo from '@material-ui/core/colors/indigo';

class TasksList extends Component {
    render() {
        return (
            <div>  
                <List>
                { this.props.tasks.map(task => (
                    <ListItem key={task.id}>
                        {/*<Avatar style={{background: indigo[500]}}><AssignmentIcon /></Avatar>*/}
                        <Button title="Mark the task as complete" onClick={this.props.onTaskComplete}>
                            <Avatar style={{background: indigo[500]}}><DoneIcon /></Avatar>
                        </Button>
                        <ListItemText primary={task.title} secondary={ 'Last updated at ' + task.updated } />
                    </ListItem>
                ))}
                </List>
            </div>
        )
    }
}

export default TasksList;