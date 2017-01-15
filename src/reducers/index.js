import { combineReducers } from 'redux';
let id = 0;

const posts = (state = [], action) => {
  if (action.type === 'ADD_POST') {
    console.log(action);
    return [
      {
        id: ++id,
        url: action.payload.url,
        title: action.payload.title,
        comments: [],
        votes: 0
     },
      ...state
    ]
  }
  else {
    return state;
  }
}

const isAddNewDropdownOpen = (state = false, action) => {
  if (action.type === 'TOGGLE_ADD_NEW_DROPDOWN') {
    return !state;
  }
  else {
    return state;
  }
}

export default combineReducers({
  posts,
  isAddNewDropdownOpen
});
