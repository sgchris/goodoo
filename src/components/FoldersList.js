import React, { Component } from 'react'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import CreateIcon from '@material-ui/icons/Create';
import {formatRelative} from 'date-fns';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import ConfirmationBox from '../services/ConfirmationBox';

class FoldersList extends Component {

    constructor(props) {
        super(props);

        this.onFolderClick = this.onFolderClick.bind(this);
        this.onFolderRename = this.onFolderRename.bind(this);
        this.onFolderDelete = this.onFolderDelete.bind(this);
    }

    
    onFolderClick(event, folderData) {
        this.props.onFolderClick(folderData);
    }

    onFolderRename(event, folderData) {
        event.stopPropagation();
        this.props.onFolderRename(folderData);
    }

    onFolderDelete(event, folderData) {
        event.stopPropagation();
        this.props.onFolderDelete(folderData);
    }

    render() {
        return (
            <div>  
                <List>
                { this.props.folders.map(folder => (
                    <ListItem button key={folder.id} 
                        selected={this.props.selectedFolderId && this.props.selectedFolderId === folder.id}
                        onClick={event => this.onFolderClick(event, folder)}
                    >
                        <IconButton title="Rename folder" onClick={event => this.onFolderRename(event, folder)}>
                            <Avatar><CreateIcon /></Avatar>
                        </IconButton>
                        <ListItemText primary={folder.title} secondary={ 
                            <React.Fragment>
                                Last updated at {formatRelative(new Date(folder.updated), new Date())}
                            </React.Fragment>
                        } />

                        <ListItemSecondaryAction>
                            <ConfirmationBox title="Delete folder" content="This will delete all the tasks in that folder. Are you sure?">
                            {confirm => (
                                <IconButton aria-label="Delete" onClick={event => confirm(() => this.onFolderDelete(event, folder))}>
                                    <DeleteIcon />
                                </IconButton>
                            )}
                            </ConfirmationBox>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
                </List>
            </div>
        )
    }
}

export default FoldersList;