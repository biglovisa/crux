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
    case 'UPDATE_TASK':
      return state.map(task => {
        if (task.id === action.payload.id) {
          const { title, description } = action.payload
          task.title = title === "" ? task.title : title
          task.description = description === "" ? task.description : description
        }
        return task
      })
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
