import React, {Component} from 'react';
import { createStore } from 'redux';
import axios from 'axios';
import todoReducer from '../Reducers/Todo';

class List extends Component {
    
    
    constructor(props) {
        super(props);
        this.store = createStore(todoReducer);
        this.loadItems();

        this.addItem = this.addItem.bind(this);
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
    
    addItem(event) {
        this.store.dispatch({
            type: 'TODO_MARK_IN_PROGRESS'
        });

        axios.post('http://api.goodoo.co/todos', {
            text
        }).then(() => {
            this.store.dispatch({
                type: 'TODO_ADD',
                text
            });
        }).finally(() => {
            this.store.dispatch({
                type: 'TODO_UNMARK_IN_PROGRESS'
            });
        });
        event.preventDefault();
        
        const text = event.target.new_todo_item.value;
        const currentStore = this.store;
        axios.post('https://jsonplaceholder.typicode.com/todos', {
            text
        }).then(() => {
            currentStore.dispatch({
                type: 'TODO_ADD',
                text
            });
        }).finally(() => {
            currentStore.dispatch({
                type: 'TODO_UNMARK_IN_PROGRESS'
            });
        })
    }
    
    render() {
        const liItems = this.store.getState().map(todoItem => {
            return (
                <li key={'todoitem-' + todoItem.id} className="collection-item">{todoItem.text}</li>
            );
        })

        return (
            <ul className="collection">
                <li key="new-todo-item" className="collection-item">
                    <form onSubmit={this.addItem}>
                        <div className="row">
                            <div className="input-field col m10 s12">
                                <input type="text" id="new_todo_item" />
                                <label htmlFor="new_todo_item">New todo item</label>
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