import React, { Component, PropTypes} from 'react'

import Form from './Form'

export default class Task extends Component {
  state = { isEditing: false }

  shouldComponentUpdate(nextProps, nextState) {
    const { description, title } = this.props;
    if (nextProps.description === description && nextProps.title === title && this.state.isEditing) {
      return false
    }
    return true
   }

  handleSubmit(task) {
    this.setState({ isEditing: false })
    this.props.onUpdate(Object.assign(task, { id: this.props.id }));
  }

  renderTask() {
    const { description, id, onDelete, title } = this.props
    return (
      <div>
        <h3>{ title }</h3>
        <p>{ description }</p>
        <button onClick={ onDelete.bind(null, id) }>Delete</button>
        <button onClick={ () => this.setState({ isEditing: true }) }>Edit</button>
      </div>
    )
  }

  render() {
    const content = this.state.isEditing ? <Form onSubmit={ this.handleSubmit.bind(this) }
                                                 defaults={ { title: this.props.title, description: this.props.description } }
                                                 />
                                         : this.renderTask()
    return (
      <div key={ this.props.id }>
        { content }
      </div>
    )
  }
}

Task.PropTypes = {
  description: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}
