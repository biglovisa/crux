import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../actions'

import Feed from '../components/Feed';
import Header from '../components/Header';

const Main = ({ posts, actions }) => (
  <div>
    <Header handleAddPost={actions.addPost} />
    <Feed posts={posts} />
  </div>
);

Main.propTypes = {
  posts: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  posts: state.posts
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)
