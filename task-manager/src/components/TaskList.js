import React, { Component, PropTypes } from 'react'

export default class TaskList extends Component {
  render() {
    const tasks = this.props.tasks.map((task) => {
      return (
        <div key={ task.id }>
          <h3>{ task.title }</h3>
          <p>{ task.description }</p>
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
  handleDeleteTask: PropTypes.function.isRequired
}
