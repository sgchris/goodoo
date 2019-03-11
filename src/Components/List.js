import React, {Component} from 'react';


const todoReducer = (state = [], action) => {
    switch (action.type) {
        case 'TODO_ADD': 
            return [
                ...state,
                {
                    id: action.id,
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
    
    
    loadItems() {
        this.setState(ps => {
            // return static content
            return {
                items: [{
                    id: 1,
                    content: 'todo item'
                },{
                    id: 2,
                    content: 'another todo item'
                }]
            };
        });
    }
    
    render() {
        loadItems();
        
        return (
            <ul className="collection">
                <li className="collection-item">
                    some item
                </li>
            </ul>
        )
    }
}

export default List;