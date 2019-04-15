import React, { Component } from 'react'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import CreateIcon from '@material-ui/icons/Create';
import {formatRelative} from 'date-fns';
import IconButton from '@material-ui/core/IconButton';


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
                    </ListItem>
                ))}
                </List>
            </div>
        )
    }
}

export default FoldersList;