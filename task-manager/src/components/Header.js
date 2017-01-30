import React, { Component, PropTypes } from 'react';

export default class Header extends Component {
  render() {
    return (
      <div className="header">
        <h1>{this.props.title}</h1>
      </div>
    )
  }
}

Header.PropTypes = {
  title: PropTypes.string.isRequired
}
