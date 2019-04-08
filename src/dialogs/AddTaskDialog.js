import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import 'date-fns';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';



export default class AddTaskDialog extends React.Component {
    taskTitle = '';
    taskDate = null;
    taskTime = null;

    handleDateChange = date => {
        console.log('date changed', date);
        this.taskDate = date;
    }
    handleTimeChange = time => {
        console.log('time changed', time);
        this.taskTime = time;
    }
    handleTitleChange = event => {
        this.taskTitle = event.target.value;
    }
    render() {
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={this.props.onClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Add task</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Add new task to {this.props.folderName} list
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="The task"
                            type="text"
                            fullWidth
                            onChange={this.handleTitleChange}
                        />

                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                margin="normal"
                                label="Date picker"
                                onChange={this.handleDateChange}
                            />
                            <TimePicker
                                margin="normal"
                                label="Time picker"
                                onChange={this.handleTimeChange}
                            />
                        </MuiPickersUtilsProvider>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.onClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.props.callback} color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}