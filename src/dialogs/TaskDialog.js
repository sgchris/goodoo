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

export const DIALOG_TYPES = {
    DIALOG_TYPE_CREATE: 'dialog_type_create',
    DIALOG_TYPE_EDIT: 'dialog_type_edit',
};

const initialState = {
    open: false,
    addRemider: false,
    date: new Date(),
    title: '',
}

export default class TaskDialog extends React.Component {
    taskTitle = '';
    taskDate = null;
    taskTime = null;

    constructor(props) {
        super(props);
        this.state = initialState;

        // read initial values from props (in case of "edit")
        this.state.title = this.props.title || this.state.title;
        this.state.date = this.props.date || this.state.date;
        this.state.addRemider = this.props.addRemider || this.state.addRemider;
        

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleAddReminderChange = this.handleAddReminderChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    componentDidMount() {
        this.setState({
            open: this.props.open,
            title: this.props.title,
            date: this.props.date,
            addRemider: this.props.addRemider,
        });
    }

    componentWillReceiveProps(nextProps) {
        let newState = {};
        if (nextProps.open !== this.state.open) {
            newState.open = nextProps.open;
        }
        if (nextProps.title !== this.state.title) {
            newState.title = nextProps.title;
        }
        if (nextProps.date !== this.state.date) {
            newState.date = nextProps.date;
        }
        if (nextProps.addRemider !== this.state.addRemider) {
            newState.addRemider = nextProps.addRemider;
        }

        this.setState(newState);
    }

    handleDateChange = date => {
        this.setState({date})
    }

    handleTitleChange = event => this.setState({title: event.target.value});

    handleClose = () => {
        this.setState({open: false});

        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    handleAddReminderChange = event => this.setState({addRemider: event.target.checked});

    handleCallback = (event) => {
        event.preventDefault();

        if (this.props.callback) {
            let newData = {
                title: this.state.title,
                date: this.state.date && this.state.date.toISOString ? this.state.date.toISOString() : null,
                addRemider: this.state.addRemider,
            };

            this.props.callback(newData);
        }

        // this.setState(initialState);

        return false;
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
                    <form onSubmit={this.handleCallback}>
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
                                                onChange={
                                                    event => {
                                                        this.setState({addRemider: event.target.checked})
                                                    }
                                                }
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
                            <Button type="button" onClick={this.handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button type="submit" onClick={this.handleCallback} color="primary">
                                { this.props.title ? 'Update' : 'Add' }
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </div>
        );
    }
}