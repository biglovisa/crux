import { combineReducers } from 'redux';

const title = (state = 'Task Manager', action) => {
  return state
}

export default combineReducers({
  title
});
