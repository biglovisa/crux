import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Header from '../components/Header'

const RootContainer = ({ title }) => (
  <div>
    <Header title={title} />
  </div>
)

const mapStateToProps = (state) => {
  return {
    title: state.title
  }
}

export default connect(mapStateToProps)(RootContainer);
