import { combineReducers } from 'redux';

const tasks = (state = [], action) => {
  if (action.type === 'CREATE_TASK') {
    const { title, description } = action.payload
    return [
      { title, description },
      ...state
    ]
  }
  return state
}

const title = (state = 'Task Manager', action) => {
  return state
}

export default combineReducers({
  tasks,
  title
})
