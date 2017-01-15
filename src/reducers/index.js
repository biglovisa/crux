import { combineReducers } from 'redux';

let id = 1;
const initialState = [
  {
    id: id,
    image: 'http://cdn3-www.cattime.com/assets/uploads/2011/08/best-kitten-names-1.jpg',
    title: 'what a beaut',
    comments: [
      {
        author: 'Lovisa',
        body: 'what a beaut'
      },
      {
        author: 'Tyler',
        body: 'This is great cat'
      }
    ],
    votes: 0
  }
]

const posts = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_POST':
      return [
        {
          id: ++id,
          image: 'http://www.petlandkennesaw.com/wp-content/uploads/2016/06/kitten-little.jpg',
          title: 'so lol',
          comments: [],
          votes: 0
        },
        ...state
      ];
    default:
      return state;
  }
}

export default combineReducers({
  posts
});
