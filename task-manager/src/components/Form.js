import React, { Component, PropTypes } from 'react'

export default class Form extends Component {
  state = { title: '', description: '' }

  handleSubmit() {
    this.props.onSubmit(this.state)
  }

  render() {
    return (
      <div>
        <div>
          <label>Title</label>
          <input placeholder={ this.props.defaults && this.props.defaults.title } onChange={(e) => this.setState({ title: e.target.value })} />
        </div>
        <div>
          <label>Description</label>
          <input placeholder={ this.props.defaults && this.props.defaults.description } onChange={(e) => this.setState({ description: e.target.value })} />
        </div>
        <button type="submit" onClick={this.handleSubmit.bind(this)}>Submit</button>
      </div>
    )
  }
}

Form.PropTypes = {
  onSubmit: PropTypes.func.isRequired,
  defaults: PropTypes.object,
}
