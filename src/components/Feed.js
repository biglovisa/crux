import React, { PropTypes, Component } from 'react'

export default class Feed extends Component {
  static propTypes = {
    posts: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {
    const posts = this.props.posts.map(this._createPostElement);

    return (
      <div className="posts">
        {posts}
      </div>
    );
  }

  _createPostElement(post) {
    return (
      <div className="post" key={post.id}>
        <img src={post.url} />
        <div className="post-toolbar">
          <p>{post.title}</p>
          <p><i className="fa fa-comments" aria-hidden="true"></i>{post.comments.length || 0}</p>
        </div>
      </div>
    );
  }
}
