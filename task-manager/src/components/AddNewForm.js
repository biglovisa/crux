import React, { Component } from 'react';


export default class AddNewForm extends Component {
  id = 0
  state = { title: '', description: '' }

  onClick() {
    const { title, description } = this.state
    this.props.handleSubmitAction({ id: this.id++, title, description })
  }

  render() {
    return (
      <div className="add-new-form">
        <div>
          <label>Title</label>
          <input onChange={(e) => this.setState({ title: e.target.value })} />
        </div>
        <div>
          <label>Description</label>
          <input onChange={(e) => this.setState({ description: e.target.value })} />
        </div>
        <button type="submit" onClick={this.onClick.bind(this)}>Submit</button>
      </div>
    )
  }
}
