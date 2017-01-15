import React, { PropTypes, Component } from 'react'
import Post from './Post';

export default class Feed extends Component {
  static propTypes = {
    posts: PropTypes.array.isRequired,
    handleDelete: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {
    const posts = this.props.posts.map((post) => <Post {...post} handleDelete={this.props.handleDelete} key={post.id} />);

    return (
      <div className="posts">
        {posts}
      </div>
    );
  }
}
