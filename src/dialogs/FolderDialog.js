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
    title: '',
}

export default class FolderDialog extends React.Component {
    taskTitle = '';

    constructor(props) {
        super(props);
        this.state = initialState;

        // read initial values from props (in case of "edit")
        this.state.title = this.props.title || this.state.title;

        // bind
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleCallback = this.handleCallback.bind(this);
    }

    componentDidMount() {
        this.setState({
            open: this.props.open,
            title: this.props.title
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
        this.setState(newState);
    }

    handleTitleChange = event => this.setState({title: event.target.value});

    handleClose = () => {
        this.setState({open: false});

        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    handleCallback = event => {
        event.preventDefault();
        
        this.setState({open: false});
        
        if (this.props.callback) {
            let newData = {
                title: this.state.title
            };
            this.props.callback(newData);
        }

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
                            Add Folder
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
                                onChange={this.handleTitleChange}
                                />
                        </DialogContent>
                        <DialogActions>
                            <Button type="button" onClick={this.handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button type="submit" color="primary">
                                { 'title' in this.props ? 'Update' : 'Add' }
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </div>
        );
    }
}