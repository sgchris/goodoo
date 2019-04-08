import React, { Component } from 'react'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import WorkIcon from '@material-ui/icons/Work';


class FoldersList extends Component {
    render() {
        return (
            <div>  
                <List>
                { this.props.folders.map(folder => (
                    <ListItem button key={folder.id} 
                        selected={this.props.selectedFolderId && this.props.selectedFolderId === folder.id}
                        onClick={event => this.props.folderClick(event, folder)}
                    >
                        <Avatar>
                            <WorkIcon />
                        </Avatar>
                        <ListItemText primary={folder.title} secondary={ 'Last updated at ' + folder.updated } />
                    </ListItem>
                ))}
                </List>
            </div>
        )
    }
}

export default FoldersList;