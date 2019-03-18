const todoReducer = (state = [], action) => {
    
    switch (action.type) {
        case 'TODO_ADD': 
            const maxId = state.reduce((currentMax, todo) => Math.max(currentMax, todo.id), 0);
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
                return (todo.id !== action.id);
            });
        case 'TODO_MARK_COMPLETE': 
            return state.map(todo => {
                if (todo.id === action.id) {
                    todo.completed = true;
                }
                
                return todo;
            });
        case 'TODO_MARK_IN_PROGRESS': 
            return state.map(item => {
                if (item.id === action.id) {
                    item.inProgress = true;
                }

                return item;
            });
        case 'TODO_UNMARK_IN_PROGRESS': 
            return state.map(item => {
                if (item.id === action.id) {
                    item.inProgress = false;
                }

                return item;
            });
        default: 
            return state;
    }
}

export default todoReducer;