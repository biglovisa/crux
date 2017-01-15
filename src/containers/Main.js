import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../actions'

import Feed from '../components/Feed';
import Header from '../components/Header';

const Main = ({ posts, actions, isAddNewDropdownOpen }) => (
  <div>
    <Header toggleAddNewDropdown={actions.toggleAddNewDropdown}
            handleAddPost={actions.addPost}
            isAddNewDropdownOpen={isAddNewDropdownOpen} />
    <Feed posts={posts} />
  </div>
);

Main.propTypes = {
  posts: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  isAddNewDropdownOpen: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  posts: state.posts,
  isAddNewDropdownOpen: state.isAddNewDropdownOpen
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)
