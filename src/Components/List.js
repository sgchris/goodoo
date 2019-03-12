import React, {Component} from 'react';
import { createStore } from "redux";

const todoReducer = (state = [], action) => {
    
    switch (action.type) {
        case 'TODO_ADD': 
            const maxId = state.reduce((currentMax, todo) => Math.max(currentMax, todo.id), 0);
            console.log('maxid', maxId);
            return [
                ...state,
                {
                    id: maxId + 1,
                    text: action.text,
                    completed: false
                }
            ];
        case 'TODO_REMOVE': 
            return state.filter(todo => {
                return (todo.id != action.id);
            });
        case 'TODO_MARK_COMPLETE': 
            return state.map(todo => {
                if (todo.id == action.id) {
                    todo.completed = true;
                }
                
                return todo;
            });
        default: 
            return state;
    }
}


class List extends Component {
    
    store = createStore(todoReducer);
    
    constructor(props) {
        super(props);
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
    
    render() {
        const liItems = this.store.getState().map(todoItem => {
            return (
                <li className="collection-item">{todoItem.text}</li>
            );
        })
        
        return (
            <ul className="collection">
            {liItems}
            </ul>
        )
    }
}

export default List;