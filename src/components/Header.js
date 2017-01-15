import React, { PropTypes, Component } from 'react'

export default class Header extends Component {
  static propTypes = {
    handleAddPost: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <button onClick={this.props.handleAddPost}>Add post</button>
    )
  }
}
