import { combineReducers } from 'redux';
let id = 1;

const initialState = [{id: 1, url: 'http://www.petlandkennesaw.com/wp-content/uploads/2016/06/kitten-little.jpg', title: "whaaat", comments: ['so cute'], votes: 0}];

const posts = (state = initialState, action) => {
  if (action.type === 'ADD_POST') {
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
