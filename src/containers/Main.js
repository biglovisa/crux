import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../actions'

import Feed from '../components/Feed';

const Main = ({ posts, actions }) => (
  <div>
    <Feed posts={posts} handleAddPost={actions.addPost} />
  </div>
);

Main.propTypes = {
  posts: PropTypes.array.isRequired,
  handleAddPost: PropTypes.object.isRequired
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
