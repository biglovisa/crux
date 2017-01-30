import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Header from '../components/Header'

const RootContainer = () => (
  <div>
    <Header />
  </div>
)

export default connect()(RootContainer)
