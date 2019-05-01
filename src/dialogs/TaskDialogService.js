import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
 
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';
import { Checkbox } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { Typography } from '@material-ui/core';

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

export default class TaskDialogService extends React.Component {

    state = {
        open: false,
        type: DIALOG_TYPES.DIALOG_TYPE_CREATE,

        // dialog data
        folderName: '',
        title: '',
        addRemider: false,
        due: null,

        // user callback on submit
        callback: null
    };

    constructor(props) {
        super(props);

        this.openTaskDialog = this.openTaskDialog.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleCallback = this.handleCallback.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    openTaskDialog(folderName, title, due, callback) {
        if (!folderName) {
            console.error('Folder name must be provided TaskDialogService::openTaskDialog');
        }

        
        // init params
        callback = callback || null;
        title = title || '';
        due = due || null;
        let addRemider = Boolean(due);
        let dialogType = title ? DIALOG_TYPES.DIALOG_TYPE_EDIT : DIALOG_TYPES.DIALOG_TYPE_CREATE;

        // update internal params, and display the popup
        this.setState(
            {callback, folderName, title, addRemider, due}, 
            () => this.setState({
                open: true,
                callback
            })
        );
    }

    handleDateChange(due) {
        this.setState({
            due
        });
    }

    handleCallback() {
        this.setState({
            open: false
        });

        if (this.state.callback) {
            let due = this.state.addRemider ? this.state.due : null;

            if (due instanceof Date) {
                due = due.toISOString();
            }
            this.state.callback(this.state.title, due);
        }
    }
    
    handleClose() {
        this.setState({
            open: false
        });
    }

    render() {
        return (
            <React.Fragment>
                {this.props.children(this.openTaskDialog)}
                {this.state.open && (
                    <Dialog
                        fullWidth={true}
                        maxWidth="md"
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="form-dialog-title"
                    >
                        <form onSubmit={this.handleCallback}>
                            <DialogTitle id="form-dialog-title">
                                Add task {this.state.folderName && 'to "' + this.state.folderName + '"'}
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
                                        onChange={event => this.setState({title: event.target.value})}
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
                                            value={this.state.due}
                                            onChange={this.handleDateChange}
                                            />
                                        <TimePicker
                                            disabled={!this.state.addRemider}
                                            margin="normal"
                                            label="Time picker"
                                            value={this.state.due}
                                            onChange={this.handleDateChange}
                                        />
                                    </MuiPickersUtilsProvider>
                            </DialogContent>
                            <DialogActions>
                                <Button type="button" onClick={this.handleClose} color="primary">
                                    Cancel
                                </Button>
                                <Button type="submit" onClick={this.handleCallback} color="primary">
                                    { this.state.type == DIALOG_TYPES.DIALOG_TYPE_EDIT ? 'Update' : 'Add' }
                                </Button>
                            </DialogActions>
                        </form>
                    </Dialog>
                )}
            </React.Fragment>
        )
    }
}