# Crux (or Task Manager)
## Crud + Redux with React

In this tutorial we are going to build a Redux app where we can create, view, edit, and delete tasks. It is assumed that you are familiar with JavaScript, web applications, and React. If you are not familiar with React, consider checking out the [creact](https://github.com/applegrain/creact/) tutorial.

### Sections

0. [Redux 101](0-redux-101)
1. [Setting up the app](1-setting-up-the-app)

<br>

### 0. Redux 101

Redux wasn't the first of its kind. Before it got popular in mid-2015, there were many projects that had attempted solving the same problem: managing state across a larger front end application.

With Redux, you maintain your application state in a store. You keep a single state object in the store, and when you update it, you cannot mutate it but rather, have to replace it with a new object. You connect components to the Redux store so that they are notified of any state changes when those occur.

When something happens in a component that should change the state, you dispatch an action. The action is basically just a POJO (plain old JavaScript object) with a few special keys. This object is required to have a key `type` which points to a string value (the name of the action, or the action type). Other keys in the action object can be user entered data that we're going to save in our database.

When an action is dispatched, it's run through the reducers where we can specify how the state should update based on what type the given action has. **The inputs to a reducer is the state and the action, and the output is a new, updated, version of the application state.** Reducers are pure functions, meaning that they cannot have side effects or mutate data.

The new state that's returned by the reducer gets set in the Redux store. The components that are connected to the redux store will be notified about the state change and re-render accordingly.

For more information about how Redux works, check out this [cartoon guide](https://code-cartoons.com/a-cartoon-intro-to-redux-3afb775501a6#.n2qtjwsvh).

Another important thing about using Redux with React is the notion of presentational vs container components. You might have heard of "smart" and "dumb" components, and this is very similar. In an effort to separate concerns and isolate dependencies on state, we write as many presentational, dumb, components as possible. Dumb components receive data from their parents (in the form of props) and render differently based on that data.

Container components are aware of Redux and are connected to the Redux store. Most of the logic should end up here. In these container components, we can calculate based on state what data and callbacks we need to pass down to the dumb components.

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
