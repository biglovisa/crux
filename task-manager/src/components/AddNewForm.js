import React, { Component } from 'react';

import Form from './Form'

export default class AddNewForm extends Component {
  id = 0
  handleSubmit(task) {
    this.props.handleSubmitAction(Object.assign(task, { id: this.id++ }))
  }

  render() {
    return <Form onSubmit={ this.handleSubmit.bind(this) } />
  }
}
