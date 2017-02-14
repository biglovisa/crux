# Crux (or Task Manager)
## Crud + Redux with React

In this tutorial we are going to build a Redux app where we can create, view, edit, and delete tasks. It is assumed that you are familiar with JavaScript, web applications, and React. If you are not familiar with React, consider checking out the [creact](https://github.com/applegrain/creact/) tutorial.

### Sections

0. [Redux 101](0-redux-101)
1. [Setting up the app](1-setting-up-the-app)
2. [Adding a Header](2-adding-a-header)
3. [Passing props to the Header](3-passing-props-to-the-header)
4. [Create a task](4-create-a-task)
5. [View tasks](5-view-tasks)
6. [Delete a task](6-delete-a-task)
7. [Small improvement](7-small-improvement)
8. [Edit a task](8-edit-a-task)

<br>

### 0. Redux 101

Other very useful information on Redux:

- [Tutorial videos by Dan Abramov](https://egghead.io/courses/getting-started-with-redux)
- [Redux docs](http://redux.js.org/docs/basics/)
- [Lin Clark's cartoon guide](https://code-cartoons.com/a-cartoon-intro-to-redux-3afb775501a6#.n2qtjwsvh)

Redux TL:DR;

Redux keeps a single immutable state object in the store, so when it's updated it needs to be replaced with a new object. You connect components to the Redux store so that they are notified of any state changes when those occur.

To update the global application state, you dispatch actions. The action is essentially just an object, with a required key `type` used to identify it. The action object can have more keys, carrying other information needed to update state.

The dispatched actions are run through a set of so-called reducers where we can update the state based on the action's `type`. The reducers never mutate the application state, it always returns a new, potentially modified, copy of the application state.   

Another thing I won't cover in detail is the difference between containers and components. Container components are aware of Redux and are connected to the Redux store. Most of the logic should end up here. In these container components, we can calculate based on state what data and callbacks we need to pass down to the presentational components.

Also check out the [docs on presentational and container components](http://redux.js.org/docs/basics/UsageWithReact.html#presentational-and-container-components).

### 1. Setting up the app

Navigate somewhere you'd like to keep this code. Create a directory and `cd` into it.

```shell
$ mkdir task-manager
$ cd task-manager
```

When you're there, start by creating a `package.json` file. Run `npm init` and answer the questions. When it asks about `entry point:`, enter `server.js`. If you have a file called `server.js` in your root, `npm start` will automatically run that file, without you having to add a start script.

Then, continue by installing the packages we'll need.

For our dependencies, we just need [express](http://expressjs.com/), [react](https://facebook.github.io/react/), [redux](http://redux.js.org/), and [react-redux](http://redux.js.org/docs/basics/UsageWithReact.html).

```shell
$ npm i --save react react-dom redux react-redux express
```

We also need to add [babel](https://babeljs.io) and [webpack](https://webpack.github.io/) to our project. Even though they are just two pieces, we need A TON of dev dependencies since a lot of functionality is broken out into modules.

```shell
$ npm i --save-dev babel babel-core babel-loader babel-polyfill babel-preset-env babel-preset-es2015 babel-preset-react babel-plugin-transform-class-properties babel-register webpack webpack-dev-middleware webpack-dev-server webpack-hot-middleware
```

Great!

In order for the babel package to work correctly, we need to add a config file, a `.babelrc` file.

We can simply add the contents of the file using `echo` in the terminal.

```shell
$ echo "{
  "presets": ["react", "es2015"],
  "plugins": ["transform-class-properties"]
}
" > .babelrc
```

Run `cat .babelrc` in your terminal to make sure we added the config ok.

Before we build the server, let's add your `webpack.config.js`. In here, we have our webpack configuration. Webpack is a very modular tool as well, so you can customize it however you need to fit your needs. We will be working with a very simple app, so it won't be very complicated.

```shell
$ touch webpack.config.js
```

Webpack is a tool which will transpile all your JavaScript, Json, and CSS files. This is useful for a lot of reasons, for example, it can improve the general performance and size of your app, and compile newer versions of JavaScript to older ones with cross-browser support.

To set it up, in your `webpack.config.js`, you need to specify an entry point (where webpack will look for files) and an output path (where webpack will spit out the code bundle). If we specify in our config to output the bundle to `path/to/bundle.js`, then we will load a script from `path/to/bundle.js` in our index.html page.

**webpack.config.js**
```JavaScript
var path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: {
    main: ['babel-polyfill', './src/index.js']
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '/public/',
    filename: '[name].bundle.js'
  }
};
```

Next, we need to specify a loader for our JavaScript files. We need to parse all `.js` files with the `babel` loader so that we are only shipping JavaScript that's supported by all browsers. Newer language features aren't universally supported and may cause runtime errors.

**webpack.config.js**
```JavaScript
    ...
    publicPath: '/public/',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js?$/, exclude: /node_modules/, loader: 'babel' }
    ]
  }
};
```

Lastly, we also have to specify which file extensions webpack should be looking for. Adding an extension in this array means that you can require them in your program without using the extensions.

For example: adding `.js` extension to the array enables importing files like this: `import Lol from './lol'`, where the relative path to the file is `./lol.js`.

**webpack.config.js**
```JavaScript
    ...
      { test: /\.js?$/, exclude: /node_modules/, loader: 'babel' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.scss', '.css']
  }
};
```

Perfect!

Before we build our server, let's add an `index.html` page. We are going to serve static assets from a directory called `public`, so let's start by creating a `public` directory and putting an html page there.

```shell
$ mkdir public
$ touch public/index.html
```

Below is an example of what your html file could look like. The most important pieces are the empty `div` with id "root" and the `script` tag at the bottom of the file. We are going to use the empty div to render our React/Redux code in, and we are loading all our JavaScript from `public/main.bundle.js`.

**index.html**
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>task manager</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
  <script src="public/main.bundle.js" charset="utf-8"></script>
</html>
```

Now, let's create a server.

```shell
$ touch server.js
```

First, set up a route for the root path and serve our html page when we hit it. Note that we are telling express to serve static assets from the `public` directory.

**server.js**
```JavaScript
const path = require('path');
const express = require('express');

const app = express();
const PORT = 8080;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendFile(__dirname, 'public/index.html');
});

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT + '....');
});
```

Now, when you run `npm start` in your terminal, the app should start up and display an empty page.

We are essentially done, but in order to make it a bit easier to develop, let's also add middleware so that we can hot reload our code. This means that whenever we make a change to our JavaScript code, webpack will rebundle the code for us. The alternative would be to stop/start your server whenever you have a code change.

**server.js**
```JavaScript
...
const webpack = require('webpack');

const config = require('./webpack.config.js');
const compiler = webpack(config);

app.use(require('webpack-hot-middleware')(compiler));
app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  stats: { colors: true }
}));

app.get('/', function(req, res) {
  ...
})

...
```

Now, when you start your server, you'll notice more logging printing to the screen.

Last thing we are going to do in this section is to create a `src` directory and add an `index.js` file. In the next section we'll start working with JavaScript.

### 2. Adding a Header

In this section we are going to set up the Redux store, our container component, and render a dumb React component.

In the `index.js` file we created in the `src` directory, and in that file we are going to put our root container. We are going to connect the root container to the redux store so that we are notified of any state changes. Using the state object, we then can "prepare" data and functions we pass down to presentational (dumb) components that are rendered in the root container.

Let's create the root container and the

```shell
$ touch src/containers/RootContainer.js src/components/Header.js
```

First, we need to import some stuff.

**src/index.js**
```JavaScript
import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import RootContainer from './containers/RootContainer'
import reducer from './reducers'
```

`createStore` is a well named function used to create Redux stores and `Provider` is a wrapper component which is given a redux store as a prop, and notifies connected components to state changes.

We pass a reducer to the `createStore` function to create a store. When an action dispatches, it will go through the given reducers to determine what changes need to be made to state.

So, to create a store:

**src/index.js**
```JavaScript
const store = createStore(reducer)
```

And to our `render` function we pass the `Provider` component, with our store as its prop, and around it the RootContainer.

**src/index.js**
```JavaScript
render(
  <Provider store={store}>
    <RootContainer />
  </Provider>,
  document.getElementById('root')
)
```

Now, we move on to the root container.

Again, we import some stuff and import the Header component we are going to use. `connect` is the function we use to

**src/containers/RootContainer.js**
```JavaScript
import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Header from '../components/Header'
```

For now, our `RootContainer` component can be as simple as this:

**src/containers/RootContainer.js**
```JavaScript
const RootContainer = () => (
  <div>
    <Header />
  </div>
)
```

To connect our container to the redux store, we pass it to the `connect` function. Or to be more specific - the return value of calling `connect()` is a function which in turn takes the component we wish to connect to the store.

**src/containers/RootContainer.js**
```JavaScript
export default connect()(RootContainer)
```

Perfect! We are almost done with this piece, we just need to finish the Header component. It's not super important what's here, so let's just render the title for now.

**src/components/Header.js**
```JavaScript
import React, { Component } from 'react';

export default class Header extends Component {
  render() {
    return (
      <div className="header">
        <h1>Task Manager</h1>
      </div>
    )
  }
}
```

### 3. Passing props to the Header

In this section we are going to set default state in the reducer, and pass it from the root container to the Header.

The state we are going to add is the title. The title is not a value that's likely on state and probably doesn't belong in the state, but for practice purposes, let's see what it might look like.

First, as usual, let's import some stuff.

**src/reducers/index.js**
```JavaScript
import { combineReducers } from 'redux';
```

The `combineReducers` function from redux is used to combine multiple reducers into one. Each reducer gets its own key in the state object. In our case, we are going to start with one reducer called `title`.

**src/reducers/index.js**
```JavaScript
export default combineReducers({
  title
});
```

`title` is a reducer function that takes two arguments - the state and the action dispatched. When we create the store, it runs through the reducer provided to check for any initial state.

Using ES6, we can pass the initial state as a default argument to the function and simply return it. Now, the state object will have one key `title` which is pointing to a string with the value `Task Manager`

**src/reducers/index.js**
```JavaScript
const title = (state = 'Task Manager', action) => {
  return state
}
```

In the container, we need to pass the value of the state to the `Header` component. There is a function called `mapStateToProps` that takes the application state as an argument, and we return an object with some of the state mapped to props we are passing to the component we are connecting to the store.

We are accessing the value of the `title` key, which is `Task Manager`. We are also passing the `mapStateToProps` function to the `connect` function as an argument.

**src/containers/RootContainer.js**
```JavaScript
const mapStateToProps = (state) => {
  return {
    title: state.title
  }
}

export default connect(mapStateToProps)(RootContainer);
```

Next, we need to "receive" the props in the `RootContainer` component and pass it to the `Header`. The container takes an object as its argument whose keys correspond to the object we return in the `mapStateToProps` function.

**src/containers/RootContainer.js**
```JavaScript
const RootContainer = ({ title }) => (
  <div>
    <Header title={title} />
  </div>
)
```

Before we verify our work in the browser, we need to use the prop passed down to the `Header` component.

**src/components/Header.js**
```JavaScript
export default class Header extends Component {
  render() {
    return (
      <div className="header">
        <h1>{this.props.title}</h1>
      </div>
    )
  }
}
```

Now that we have a prop, let's add `PropTypes` to this component.

**src/components/Header.js**
```JavaScript
import React, { Component, PropTypes } from 'react';

....

Header.PropTypes = {
  title: PropTypes.string.isRequired
}
```

And to the `RootContainer` as well.

**src/containers/RootContainer.js**
```JavaScript
import React, { PropTypes } from 'react'

....

RootContainer.PropTypes = {
  title: PropTypes.string.isRequired
}
```


### 4. Create a task

To create a task, we need to add a react component that renders a form with `title` and `deadline` input fields. When we click `submit` we need to dispatch an action which triggers a state change in a reducer. When the new state is set, our root container will be notified and pass the new data to the components it render.

Let's start by adding the form.

```shell
$ touch src/components/AddNewForm.js
```

**src/containers/RootContainer.js**
```JavaScript
import AddNewForm from '../components/AddNewForm'

const RootContainer = ({ title }) => (
  <div>
    <Header title={title} />
    <AddNewForm />
  </div>
)
```

Let's add some scaffolding in the `AddNewForm` component.

**src/components/AddNewForm.js**
```JavaScript
import React, { Component } from 'react';

export default class AddNewForm extends Component {
  render() {
    return (
      <div className="add-new-form">
      </div>
    )
  }
}
```

And then add the form:

**src/components/AddNewForm.js**
```JavaScript
render() {
  return (
    <div className="add-new-form">
      <div>
        <label>Title</label>
        <input />
      </div>
      <div>
        <label>Description</label>
        <input />
      </div>
      <button type="submit">Submit</button>
    </div>
  )
}
```

Let's add an event listener to the `Submit` button. We need to use [`bind()`]() since the `this` context is not bound to component functions. If you use `React.createClass`, the context is implicitly bound to the functions on the component. Another way to solve this problem is to bind functions in the class constructor, or use the [react-autobind](https://www.npmjs.com/package/react-autobind) library.

**src/components/AddNewForm.js**
```JavaScript

  onClick() => {
    console.log(this.state)
  }

  render() {

....

    </div>
    <button type="submit" onClick={this.onClick.bind(this)}>Submit</button>
  </div>
  )

....
```

The state we need to keep track of is the title and description. Let's add initial state, and update the state when the values in the input field is changing.

**src/AddNewForm.js**
```JavaScript
export default class AddNewForm extends Component {
  state = { title: '', description: '' }

  onClick() {

....

    <div>
      <label>Title</label>
      <input onChange={(e) => this.setState({ title: e.target.value })} />
    </div>
    <div>
      <label>Description</label>
      <input onChange={(e) => this.setState({ description: e.target.value })} />
    </div>

....
```

Now we are ready to implement the actual submitting of the new task.

The tasks should be kept in the redux store, and to update the store, we need to dispatch an action. We need to create an action, an object which _describes_ what's going to happen. We also need to add a reducer which will update the state based on what action was dispatched. Then, we can prepare and pass down the dispatch call from the root container to the AddNewForm component.  

Let's start with the action.

```shell
$ mkdir src/actions
$ touch src/actions/index.js
```

The action is a function which returns an object with a key `type` and in this case, a `payload` which will be an object with the title and description of the new task.

**src/actions/index.js**
```JavaScript
export const createTask = (payload) => ({ type: 'CREATE_TASK', payload });
```

The action will be passed to every reducer in the store, and using the type, we can react to different dispatches. Below, we have added a new reducer  - `tasks` - and added it to the `combineReducers` function. If the action type is `CREATE_TASK`, we are assuming that there is a title and a description in the payload, and are returning a new array containing the previously existing task as well as the new task object.

**src/reducers/index.js**
```JavaScript
const tasks = (state = [], action) => {
  if (action.type === 'CREATE_TASK') {
    const { title, description } = action.payload
    return [
      ...state,
      { title, description }
    ]
  }
}

....

export default combineReducers({
  tasks,
  title
})
```

Next, we need to "prepare" the dispatch in the `RootContainer` before we pass it down to the `AddNewForm`.

Just like we use `mapStateToProps` to create props from state, we use `mapStateToProps` to create props using actions and dispatch functions. Here, we are using the `bindActionCreators` function to wrap each action in a `dispatch` call instead of having to write `dispatch(myAction)` with every action. `bindActionCreators` will return an object with keys corresponding to the action names, and keys pointing to the dispatch.

**src/actions/RootContainer.js**
```JavaScript
....

import * as action from '../actions'

....

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer);
```

In next section, we are going to pass the tasks to another component which will render them on the page. For now, let's just pass them to our container component and use `console.log` to print them to the console.

We pluck the `tasks` key of the state. Look in the `combineReducers` function in `reducers/index.js`. Every reducer that we put there becomes a key on the state object.

**src/actions/RootContainer.js**
```JavaScript
...

const mapStateToProps = state => {
  return {
    tasks: state.tasks,
    title: state.title
  }
}

...

```

Then, we need to pass the `tasks` key to the container as a prop, add it in the `PropTypes` object, and print the value to the console so we can confirm we are adding tasks when we click the form button.

**src/containers/RootContainer.js**
```JavaScript
...

const RootContainer = ({ actions, tasks, title }) => (
  <div>
    {console.log('tasks:', tasks)}
    <Header title={ title } />
    <AddNewForm handleSubmitAction={ actions.createTask } />
  </div>
)

RootContainer.PropTypes = {
  actions: PropTypes.object.isRequired,
  tasks: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired
}

...
```

And hopefully when you add tasks using the form, you'll see them in the console!

### 5. View tasks

Now that we can create tasks, we should have a way to view them!

We need to create another component that takes the created tasks as a prop, iterates over them and shows the title and the description of each task.

Let's start in the `RootContainer`.

```shell
$ touch src/components/TaskList.js
```


**src/containers/RootContainer.js**
```JavaScript
....

import AddNewForm from '../components/AddNewForm'
import TaskList from '../components/TaskList'

const RootContainer = ({ actions, tasks, title }) => (
  <div>
    {console.log('tasks:', tasks)}
    <Header title={ title } />
    <AddNewForm handleSubmitAction={ actions.createTask } />
    <TasksList tasks={ tasks } />
  </div>
)

....
```

Now let's build the `TaskList` component.

We can add the `PropTypes`, since we know that we are going to receive an array of `tasks`.

**src/components/TaskList.js
```JavaScript
import React, { Component, PropTypes } from 'react'

export default class TaskList extends Component {
  render() {
    return (

    )
  }
}

TaskList.PropTypes = {
  tasks: PropTypes.array.isRequired
}

```

Next, let's render the `tasks`. We iterate over each element in the array, using the `id` as our key prop, and create html snippets using the title and description.

**src/components/TaskList.js**
```JavaScript
render() {
  const tasks = this.props.tasks.map((task) => {
    return (
      <div key={ task.id }>
        <h3>{ task.title }</h3>
        <p>{ task.description }</p>
      </div>
    )
  })
  return (
    <div>
      { tasks }
    </div>
  )
}
```

We currently don't have the code for adding an id to the task object, but we can add that real quick.

We are sending along id's in the payload...

**src/components/AddNewForm.js**
```JavaScript
....

export default class AddNewForm extends Component {
  id = 0

....

  onClick() {
    const { title, description } = this.state
    this.props.handleSubmitAction({ id: this.id++, title, description })
  }


....
```

...and are including those in the new `task` objects in the reducer.

**src/reducers/index.js**
```JavaScript
const tasks = (state = [], action) => {
  if (action.type === 'CREATE_TASK') {
    const { id, title, description } = action.payload
    return [
      { id, title, description },
      ...state
    ]
  }
  return state
}

....
```

Try it out in the browser and it should display the tasks on the page.

### 6. Delete a task

To delete a task, we should start by giving the `TaskList` a function which we can call when we click the `Delete` button. With that, we need to add an action called `deleteTask` which describes what should happen when we delete a task.

**src/containers/RootContainer.js**
```JavaScript
  <AddNewForm handleSubmitAction={ actions.createTask } />
  <TasksList tasks={ tasks } handleDeleteTask={ actions.deleteTask } />
</div>
```

We pass the id of the task to the action so we know which one to delete.

**src/actions/index.js**
```JavaScript
export const deleteTask = (id) => ({ type: 'DELETE_TASK', id })
```

Let's also write the code for the reducer.

Let's change the `if` statement in the `tasks` reducer to a `switch` statement. Since our condition is always checking the same thing, the action type, we get away with using a `switch`.

Note that we are using `filter` to iterate over the tasks on state, and remove the one whose id was passed with the action.

**src/reducers/index.js**
```JavaScript
const tasks = (state = [], action) {
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
```

Next, we just need to add code to the `TasksList`.

We add a button and add an event listener to it. When we click on the button, we pass the id to the `onDelete` function (and bind the current context to it). In `onDelete`, we are calling the dispatch function passed down to us as props and pass it the id.

We also add the `handleDeleteTask` to the `PropTypes`.

**src/components/TaskList.js**
```JavaScript
  onDelete(id) {
    this.props.handleDeleteTask(id)
  }

....

      <p>{ task.description }</p>
      <button onClick={ this.onDelete.bind(this, task.id) }>Delete</button>
    </div>


....

TaskList.PropTypes = {
  tasks: PropTypes.array.isRequired,
  handleDeleteTask: PropTypes.func.isRequired
}

```

 Try it out in the browser and hopefully it should all work!

### 7. Small improvement

We might have a lot of tasks and wouldn't want all of them to re-render if only one is edited. Now we iterate over the collection of tasks and render all of them in one component, if one item in the collection changes, all tasks - even the unedited ones - will re-render. By creating a Task component which can take a singe prop, the task object, we can limit our re-renders to the task that was actually updated.

```
$ touch src/components/Task.js
```

We can add `PropTypes` to this component already, we know that it's going to have the `id`, `title`, and `description` from the task, as well as an `onDelete` function that we call when someone clicks the `Delete` button for a task.

**src/components/Task.js**
```JavaScript
import React, { Component, PropTypes} from 'react'

export default class Task extends Component {
  render() {
    return (

    )
  }
}

Task.PropTypes = {
  description: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}

```

Now we can more or less "lift" the task rendering logic from the `map` in the `TaskList` component.

**src/components/Task.js**
```JavaScript
export default class Task extends Component {
  render() {
    const { description, id, onDelete, title } = this.props;
    return (
      <div key={ id }>
        <h3>{ title }</h3>
        <p>{ description }</p>
        <button onClick={ onDelete.bind(null, id) }>Delete</button>
      </div>
    )
  }
}
```

In the `TaskList` component, we render a `Task` component instead of building HTML to render.

**src/components/TaskList.js**
```JavaScript
import Task from './Task'

....

    const tasks = this.props.tasks.map(task => {
      return (
        <Task { ...task }
              onDelete={ this.props.handleDeleteTask }
              key={ task.id } />
      )
    })

....

```

The last thing we need to do is to add a react lifecycle hook to the `Task` component so that we can stop it from rendering when its new props are the same as its current ones.

We are using [`shouldComponentUpdate`](), which is called when a component is passed new props, before `componentWillMount`. It returns `true` by default, and when you return `false` the component does not re-render.

**src/components/Task.js**
```JavaScript
shouldComponentUpdate(nextProps) {
  return true
}
```

Before we add the last piece of code, to see how many times the component should have re-rendered, just add a `console.log()` statement in the function so you can see when this function is called. The `Delete` button is essentially the only interaction we have to test yet, however. If you're curious, try this again once we have implemented more features.

Lastly, we to determine when it is not necessary for us to re-render the component. In this case, `title` and `description` are the only props that will change, so let's only add checks for those.

**src/components/Task.js**
```JavaScript
shouldComponentUpdate(nextProps) {
  const { description, title } = this.props;
  if (nextProps.description === description && nextProps.title === title) {
    return false
  }
  return true
}
```

One more thing before we move on!

When we click the `Submit` button on our form, the input fields don't clear out. This obviously makes it annoying to add multiple tasks at once. Let's clear our the input fields after we click the `Submit` button.

**src/components/AddNewForm.js**
```JavaScript
onClick() {
  const { title, description } = this.state
  this.props.handleSubmitAction({ id: this.id++, title, description })
  this.setState({ title: '', description: '' })
}
```

In order for this state change to propagate to the input fields, we need to set the `value` of the input fields to be their corresponding state values.

**src/components/AddNewForm.js**
```jsx
....

  <div>
    <label>Title</label>
    <input value={ this.state.title } onChange={(e) => this.setState({ title: e.target.value })} />
  </div>
  <div>
    <label>Description</label>
    <input value={ this.state.description } onChange={(e) => this.setState({ description: e.target.value })} />
  </div>

....
```


### 8. Edit a task

It's important to allow our users to iterate on the task titles and description, so of course they should be able to edit their tasks.

Let's start building from the bottom up. The first chunk we are going to build out is: clicking the edit button and changing the `h3` and `p` tag to input fields. Next chunk of work for this feature is to dispatch an action when the user clicks the `Submit` button after having edited the task.

First, let's keep working on the `Task` component and start by adding a conditional in the `render` function which determines if we are going to render read only information about the task, or if we should render a form so the user can edit the task.

**src/components/Task.js**
```JavaScript
....

import Form from './Form'

export default class Task extends Component {
  state = { isEditing: false }

....

  render() {
    return (
      <div key={ this.props.id }>
        { this.state.isEditing ? <Form /> : this.renderTask() }
      </div>
    )
  }
}
```

In the `renderTask` function, we return what was previously in the render function, and in the `renderForm` function, we can seize the opportunity to build a reusable `Form` component and refactor the `AddNewForm` component to use it as well.

We added a new button, an `Edit` button which, when clicked, sets the state of `isEditing` to true.

**src/components/Task.js**
```JavaScript
....

renderTask() {
  const { description, id, onDelete, title } = this.props
  return (
    <div>
      <h3>{ title }</h3>
      <p>{ description }</p>
      <button onClick={ onDelete.bind(null, id) }>Delete</button>
      <button onClick={ () => this.setState({ isEditing: true }) }>Edit</button>
    </div>
  )
}

....
```

With this new added state, we need to extend the conditional in the `shouldComponentUpdate` hook.

That function will trigger when the `isEditing` state changes, and when it changes the title and the description will not have changed, and the conditional in the `if` statement fails, which means that the component will not update.

**src/components/Task.js**
```JavaScript
shouldComponentUpdate(nextProps, nextState) {
  const { description, title } = this.props;
  if (nextProps.description === description && nextProps.title === title && this.state.isEditing) {
    return false
  }
  return true
}
```


For the `Form` component, the only props we need to pass are the `onSubmit` function that is invoked when the user is done editing the task, as well as the current values for `title` and `description`.

**src/components/Task.js**
```JavaScript
render() {
  const content = this.state.isEditing ? <Form onSubmit={ this.handleSubmit.bind(this) }
                                               defaults={ { title: this.props.title, description: this.props.description } }
                                               />
                                       : this.renderTask()
  return (
    <div key={ this.props.id }>
      { content }
    </div>
  )
```

Let's actually build the `Form` component.

```shell
$ touch src/components/Form.js
```

**src/components/Form.js**
```JavaScript
import React, { Component, PropTypes } from 'react'

export default class Form extends Component {
  state = { title: '', description: '' }

  render() {
    return (
    )
  }
}

Form.PropTypes = {
  onSubmit: PropTypes.func.isRequired,
  defaults: PropTypes.object.isRequired
}
```

For the form itself, we can borrow almost the entire thing from the `AddNewForm` component. We get the input field placeholders from `this.props.defaults`, and when the user updates the input fields, we store that value on state, just like the `AddNewForm` component.

The callback for clicking the `Submit` button is invoking a function which passes the state, the "latest" values of title and description, as an argument.

**src/components/Form.js**
```JavaScript
....

  state = { title: '', description: '' }

  handleSubmit() {
    this.props.onSubmit(this.state)
  }  

  render() {
    return (
      <div>
        <div>
          <label>Title</label>
          <input placeholder={ this.props.defaults.title } onChange={(e) => this.setState({ title: e.target.value })} />
        </div>
        <div>
          <label>Description</label>
          <input placeholder={ this.props.defaults.description } onChange={(e) => this.setState({ description: e.target.value })} />
        </div>
        <button type="submit" onClick={this.handleSubmit.bind(this)}>Submit</button>
      </div>
    )
  }
```

Now that we have the changes in the `Task` component, refactoring it to fit the `AddNewForm` component shouldn't be that bad. :fingers_crossed:

When rendering the `Form` component from the `AddNewForm`, we don't have any default values to give (so we have to remember to change the prop to be required in the `Form`'s PropTypes). We just give it the `onSubmit` prop, and when it's invoked, we add the task's id to the object we dispatch.

**src/components/AddNewForm.js**
```JavaScript
....

import Form from './Form'

export default class AddNewForm extends Component {
  id = 0
  handleSubmit(task) {
    this.props.handleSubmitAction(Object.assign(task, { id: this.id++ }))
  }

  render() {
    return <Form onSubmit={ this.handleSubmit.bind(this) } />
  }
}
```

With the now optional `defaults` prop, we need to make another change to the `Form` component. In the jsx where we render the default values as the input fields' placeholders, we need to make sure we have that prop before we access keys off of it.

**src/components/Form.js**
```JavaScript
  ....

  <input placeholder={ this.props.defaults && this.props.defaults.title } onChange={(e) => this.setState({ title: e.target.value })} />

  ....

  <input placeholder={ this.props.defaults && this.props.defaults.description } onChange={(e) => this.setState({ description: e.target.value })} />

  ....
```

Now, back to the `Task` component and dispatching the action with the updated values.

The `onSubmit` prop we pass to the `Form` component invokes a function `handleSubmit` in the `Task` component.

First, we toggle the `isEditing` state back to false, as the user is presumably done with the editing when they `Submit` their changes. We call a function called `onUpdate` we get from props - remember to add it to the `PropTypes` - and give it the incoming argument, as well as the id of the given task, so we can find and update the right one.

**src/components/Task.js**
```JavaScript
....

  handleSubmit(task) {
    this.setState({ isEditing: false })
    this.props.onUpdate(Object.assign(task, { id: this.props.id }));
  }

....

Task.PropTypes = {
  description: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}

```

We render the `Task` in `TaskList`, so the `onUpdate` prop we call in the `Task`, should come from here. Here, our parent is the container and we can, like we did with the delete button, dispatch an action to update the global application state.

**src/components/TaskList.js**
```JavaScript
return (
  <Task { ...task }
        onDelete={ this.props.handleDeleteTask }
        onUpdate={ this.props.handleUpdateTask }
        key={ task.id } />
)
```

In the `RootContainer`, we dispatch an action called `updateTask`. That action should take the object with the id, title, and description as a payload and pass it to the reducer so we can update the task.

**src/containers/RootContainer.js**
```JavaScript
<div>
  <Header title={ title } />
  <AddNewForm handleSubmitAction={ actions.createTask } />
  <TaskList tasks={ tasks } handleDeleteTask={ actions.deleteTask } handleUpdateTask={ actions.updateTask } />
</div>
```

Add the `updateTask` action...

**src/actions/index.js**
```JavaScript
export const updateTask = (payload) => ({ type: 'UPDATE_TASK', payload })
```

And add to the switch statement in the reducer to handle the case when we are updating the task.

When we are updating a task, we iterate over the tasks in state to find the one whose id matches the id passed in the payload. When we do, we update its title and description property with the ones that we got from `action.payload`.

**src/reducers/index.js**
```JavaScript
case 'UPDATE_TASK':
  return state.map(task => {
    if (task.id === action.payload.id) {
      const { title, description } = action.payload
      task.title = title === "" ? task.title : title
      task.description = description === "" ? task.description : description
    }
    return task
  })
```

nice job

![](http://i.giphy.com/q3uHuQm4fgfdK.gif)
