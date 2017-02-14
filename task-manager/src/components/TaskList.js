import React, { Component, PropTypes } from 'react'

import Task from './Task'

export default class TaskList extends Component {
  render() {
    const tasks = this.props.tasks.map(task => {
      return (
        <Task { ...task }
              onDelete={ this.props.handleDeleteTask }
              onUpdate={ this.props.handleUpdateTask }
              key={ task.id } />
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
  handleDeleteTask: PropTypes.func.isRequired,
  handleEditTask: PropTypes.func.isRequired,
}
