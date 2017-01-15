import React, { PropTypes, Component } from 'react'

export default class Feed extends Component {
  static propTypes = {
    posts: PropTypes.array.isRequired,
    handleAddPost: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {
    const posts = this.props.posts.map(this._createPostElement);

    return (
      <div>
        <button onClick={this.props.handleAddPost}>Add post</button>
        <div className="posts">
          {posts}
        </div>
      </div>
    )
  }

  _createPostElement(post) {
    return (
      <div className="post" key={post.id}>
        <img src={post.image} />
        <div className="post-toolbar">
          <p>{post.title}</p>
          <p><i className="fa fa-comments" aria-hidden="true"></i>{post.comments.length}</p>
        </div>
      </div>
    );
  }
}

Feed.propTypes = {
  posts: PropTypes.array.isRequired,
  handleAddPost: PropTypes.func.isRequired
};
