import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';
 
import 'date-fns';

// explanation here:https://itnext.io/add-confirmation-dialog-to-react-events-f50a40d9a30d

export default class ConfirmationBox extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,

            // callback on "ok" button
            callback: null,
        };

        // bind
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

        this.openConfirmationDialog = this.openConfirmationDialog.bind(this);
    }

    handleOk = () => {
        this.setState({
            open: false
        });

        if (this.state.callback) {
            this.state.callback();
        }
    };

    handleCancel = () => {
        this.setState({
            open: false
        })
    };

    openConfirmationDialog(callback) {
        this.setState({
            open: true
        });

        if (callback) {
            this.setState({
                callback
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.props.children(this.openConfirmationDialog)}
                {this.state.open && (
                    <Dialog
                        fullWidth={true}
                        maxWidth="sm"
                        open={this.state.open}
                        onClose={this.handleCancel}
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
                            <Button type="button" onClick={this.handleCancel} color="primary">
                                { this.props.captionNo || 'No' }
                            </Button>
                            <Button type="Button" onClick={this.handleOk} color="primary">
                                { this.props.captionYes || 'Yes' }
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
            </React.Fragment>
        );
    }
}