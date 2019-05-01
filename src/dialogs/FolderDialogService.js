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

export const DIALOG_TYPES = {
    DIALOG_TYPE_CREATE: 'dialog_type_create',
    DIALOG_TYPE_EDIT: 'dialog_type_edit',
};

export default class FolderDialogService extends React.Component {

    state = {
        open: false,
        type: DIALOG_TYPES.DIALOG_TYPE_CREATE,

        // dialog data
        title: '',

        // user callback on submit
        callback: null
    };

    constructor(props) {
        super(props);

        this.openFolderDialog = this.openFolderDialog.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleCallback = this.handleCallback.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    openFolderDialog(title, callback) {
        
        // init params
        callback = callback || null;
        title = title || '';
        let dialogType = title ? DIALOG_TYPES.DIALOG_TYPE_EDIT : DIALOG_TYPES.DIALOG_TYPE_CREATE;

        // update internal params, and display the popup
        this.setState(
            {type: dialogType, callback, title}, 
            () => this.setState({
                open: true,
                callback
            })
        );
    }

    handleTitleChange(title) {
        this.setState({
            title
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
                {this.props.children(this.openFolderDialog)}
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
                                {this.state.type == DIALOG_TYPES.DIALOG_TYPE_CREATE ? 'Add' : 'Update'} Folder
                            </DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Folder name"
                                    type="text"
                                    fullWidth
                                    value={this.state.title}
                                    onChange={event => this.setState({title: event.target.value})}
                                    />
                            </DialogContent>
                            <DialogActions>
                                <Button type="button" onClick={this.handleClose} color="primary">
                                    Cancel
                                </Button>
                                <Button type="submit" color="primary">
                                    {this.state.type == DIALOG_TYPES.DIALOG_TYPE_CREATE ? 'Add' : 'Update'}
                                </Button>
                            </DialogActions>
                        </form>
                    </Dialog>
                )}
            </React.Fragment>
        )
    }
}