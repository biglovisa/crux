import React, { PropTypes, Component } from 'react'
import AddNewDropdown from './AddNewDropdown';

export default class Header extends Component {
  static propTypes = {
    toggleAddNewDropdown: PropTypes.func.isRequired,
    isAddNewDropdownOpen: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {
    const content = this.props.isAddNewDropdownOpen
      ? <AddNewDropdown handleAddPost={this.props.handleAddPost} handleCollapse={this.props.toggleAddNewDropdown} />
      : <button onClick={this.props.toggleAddNewDropdown}>Add post</button>;

    return (
      <div className="header">
        <h1>Kittens</h1>
        {content}
      </div>
    )
  }
}
