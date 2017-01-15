import React, { PropTypes, Component } from 'react'

export default class AddNewDropdown extends Component {
  static propTypes = {
    handleAddPost: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { 'url': '', 'title': '' };
  }

  render() {
    return (
      <div className="add-new-dropdown">
        <p>Add A Post</p>

        <label>Title</label>
        <input placeholder="Enter a title.." onChange={(e) => this.setState({ title: e.target.value })} />

        <label>Image URL</label>
        <input placeholder="Enter an image url" onChange={(e) => this.setState({ url: e.target.value })} />

        <button onClick={this._handleAdd.bind(this)}>Add Post</button>
        <button onClick={this.props.handleCollapse}>x</button>
      </div>
    )
  }

  _handleAdd() {
    this.props.handleAddPost({ url: this.state.url, title: this.state.title });
  }
}
