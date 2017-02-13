import React, { Component, PropTypes} from 'react'

export default class Task extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const { description, title } = this.props;
    if (nextProps.description !== description) {
      return false
    }
    if (nextProps.title !== title) {
      return false
    }
    return true
  }

  render() {
    const { description, id, onDelete, title } = this.props;
    return (
      <div key={ id }>
        <h3>{ title }</h3>
        <p>{ description }</p>
        <button onClick={ onDelete.bind(null, id) }>Delete</button>
      </div>
    )
  }
}

Task.PropTypes = {
  description: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}
