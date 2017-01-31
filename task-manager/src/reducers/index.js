import { combineReducers } from 'redux';

const tasks = (state = [], action) => {
  switch (action.type) {
    case 'CREATE_TASK':
      const { id, title, description } = action.payload
      return [
        { id, title, description },
        ...state
      ]
    case 'DELETE_TASK':
      return state.filter(task => task.id != action.id)
    default:
      return state
  }
}

const title = (state = 'Task Manager', action) => {
  return state
}

export default combineReducers({
  tasks,
  title
})
