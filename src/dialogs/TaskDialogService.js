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

export default class TaskDialog extends React.Component {

    state = {
        open: false,
        folderName: '',
        title: '', 
        due: null,
    };

    openTaskDialog(folderName, title, due) {

    }

    handleClose() {

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
                        <DialogTitle id="form-dialog-title">
                            {this.props.title || 'Confirmation'}
                        </DialogTitle>
                        <DialogContent>
                            <Typography>
                                {this.props.content || 'Are you sure?'}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button type="button" onClick={this.handleClose} color="primary">
                                { this.props.captionNo || 'No' }
                            </Button>
                            <Button type="Button" onClick={this.handleOk} color="primary">
                                { this.props.captionYes || 'Yes' }
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
            </React.Fragment>
        )
    }
}