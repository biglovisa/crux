import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import RootContainer from './containers/RootContainer'
import reducer from './reducers'

const store = createStore(reducer)

render(
  <Provider store={store}>
    <RootContainer />
  </Provider>,
  document.getElementById('root')
)
