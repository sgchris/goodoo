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
import { Checkbox } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const initialState = {
    open: false,
    addRemider: false,
    date: new Date(),
    title: '',
}

export default class AddTaskDialog extends React.Component {
    taskTitle = '';
    taskDate = null;
    taskTime = null;

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        this.setState({open: this.props.open});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.open !== this.state.open) {
          this.setState({ open: nextProps.open });
        }
    }

    handleDateChange = date => this.setState({date});

    handleTitleChange = event => this.setState({title: event.target.value});

    handleClose = () => {
        this.setState({open: false});

        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    handleCallback = () => {
        if (this.props.callback) {
            this.props.callback({
                title: this.state.title,
                date: this.state.date,
                addRemider: this.state.addRemider,
            });
        }

        this.setState(initialState);
    }

    render() {
        return (
            <div>
                <Dialog
                    fullWidth={true}
                    maxWidth="md"
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">
                        Add task {this.props.folderName && 'to "' + this.props.folderName + '"'}
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="The task"
                            type="text"
                            fullWidth
                            value={this.state.title}
                            onChange={this.handleTitleChange}
                            />

                        <DialogContentText>
                            <FormControlLabel 
                                control={(
                                    <Checkbox 
                                        color="primary"
                                        style={{marginRight: '10px'}} 
                                        onChange={event => this.setState({addRemider: event.target.checked})}
                                        checked={this.state.addRemider} 
                                    />
                                )}
                                label="Set reminder"
                            />
                        </DialogContentText>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                disabled={!this.state.addRemider}
                                margin="normal"
                                label="Date picker"
                                value={this.state.date}
                                onChange={this.handleDateChange}
                                />
                            <TimePicker
                                disabled={!this.state.addRemider}
                                margin="normal"
                                label="Time picker"
                                value={this.state.date}
                                onChange={this.handleDateChange}
                            />
                        </MuiPickersUtilsProvider>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleCallback} color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}