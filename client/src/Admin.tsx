import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import './App.css'
// import { Query } from 'react-apollo'
// import gql from "graphql-tag"

import home from './AdminPages'

class Admin extends React.Component {
  public render() {
    return (
      <Switch>
        <Route path="/" component={ home }/>
      </Switch>
    )
  }
}

export default Admin