import React, {Component} from 'react';
import { createStore } from 'redux';
import axios from 'axios';
import todoReducer from '../Reducers/Todo';

class List extends Component {
    
    
    constructor(props) {
        super(props);
        this.store = createStore(todoReducer);
        this.loadItems();
    }
    
    loadItems() {
        // temporary set static data
        this.store.dispatch({
            type: 'TODO_ADD',
            text: 'todo action'
        });
        this.store.dispatch({
            type: 'TODO_ADD',
            text: 'another todo item'
        });
    }
    
    addItem(text) {
        this.store.dispatch({
            type: 'TODO_ADD',
            text
        });
    }
    
    render() {
        const liItems = this.store.getState().map(todoItem => {
            return (
                <li className="collection-item">{todoItem.text}</li>
            );
        })

        const addButtonStyle = {
            width: '100%'
        };
        
        return (
            <ul className="collection">
                <li className="collection-item">
                    <form>
                        <div className="row">
                            <div className="input-field col m10 s12">
                                <input type="text" id="new_todo_item" />
                                <label for="new_todo_item">New todo item</label>
                            </div>
                            <div className="input-field col m2 s12">
                                <button type="submit" className="waves-effect waves-light btn" style={{width: '100%'}}>Add <i className="material-icons right">send</i></button>
                            </div>
                        </div>
                    </form>
                </li>
                {liItems}
            </ul>
        )
    }
}

export default List;