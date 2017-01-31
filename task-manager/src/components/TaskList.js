import React, { Component, PropTypes } from 'react'

export default class TaskList extends Component {
  onDelete(id) {
    this.props.handleDeleteTask(id)
  }

  render() {
    const tasks = this.props.tasks.map(task => {
      return (
        <div key={ task.id }>
          <h3>{ task.title }</h3>
          <p>{ task.description }</p>
          <button onClick={ this.onDelete.bind(this, task.id) }>Delete</button>
        </div>
      )
    })
    return (
      <div>
        { tasks }
      </div>
    )
  }
}

TaskList.PropTypes = {
  tasks: PropTypes.array.isRequired,
  handleDeleteTask: PropTypes.func.isRequired
}
