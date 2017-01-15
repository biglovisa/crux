import React, { PropTypes, Component } from 'react'
import Post from './Post';

export default class Feed extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);

    this.state = { showDetails: false };
  }

  render() {
    return (
      <div className="post">
        <img src={this.props.url} />

        <div className="post-toolbar">
          <p>{this.props.title}</p>
          <p><i className="fa fa-comments" aria-hidden="true"></i>{this.props.comments.length || 0}</p>

          <button onClick={() => this.setState({ showDetails: !this.state.showDetails })}>
            {this.state.showDetails ? 'v' : '>'}
          </button>

        </div>
        {this.state.showDetails ? this._details() : ''}
      </div>

    );
  }

  _details() {
    return (
      <div>
        <button onClick={this.props.handleDelete.bind(null, this.props.id)}>Delete</button>
        <button>Edit</button>
        <div className="comments">
          {this.props.comments.map(comment => this._comment(comment))}
        </div>
      </div>
    );
  }

  _comment(comment) {
    return (
      <p key={this.props.id}>
        {comment}
      </p>
    );
  }
}
