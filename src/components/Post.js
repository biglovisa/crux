import React, { PropTypes, Component } from 'react'
import validate from 'validate.js';
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

    this.state = { showDetails: false, editing: false, title: this.props.title, url: this.props.url };
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
    const ifEditing = this.state.editing ? this._editPost() : '';

    return (
      <div>
        <button onClick={this.props.handleDelete.bind(null, this.props.id)}>Delete</button>
        <button onClick={this._handleEdit.bind(this)}>Edit</button>
        {ifEditing}
        <div className="comments">
          {this.props.comments.map(comment => this._comment(comment))}
        </div>
      </div>
    );
  }

  _handleEdit() {
    this.setState({ editing: !this.state.editing });
  }

  _editPost() {
    return (
      <div>
        <label>
          Title
          <input value={this.state.title} onChange={(e) => this.setState({ title: e.target.value })} />
        </label>

        <label>Image URL</label>
        <input value={this.state.url} onChange={(e) => this.setState({ url: e.target.value })} />

        <button onClick={this._handleUpdatePost.bind(this)}>Update post</button>
        <button onClick={this._handleEdit.bind(this)}>Collapse</button>
      </div>
    )
  }

  _handleUpdatePost() {
    if (this._validateInputFields()) {
      this.props.handleUpdatePost({ id: this.props.id, url: this.state.url, title: this.state.title });
    }
  }

  _comment(comment) {
    return (
      <p key={this.props.id}>
        {comment}
      </p>
    );
  }

  _validateInputFields() {
    if (this.state.title.trim() === "" || validate({url: this.state.url}, {url: {url: true}})) {
      alert("Make sure you have entered a title and a valid URL.");
      return false;
    } else return true;
  }
}
