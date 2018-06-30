/* tslint:disable: no-console */
// import axios from 'axios'
import gql from "graphql-tag"
import * as React from 'react'
import { Mutation, OperationVariables } from 'react-apollo'
import '../../App.css'

const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      email
    }
  }
`

interface IState {
  email: string;
  password: string;
}

class Login extends React.Component<{}, IState> {
  public state: IState = {
    email: '',
    password: ''
  }

  private handleSubmit = (loginUser: any, e: any): void => {
    e.preventDefault();
    console.log("Here's the target: ", e.target);
    console.log("Here's the email: ", this.state.email);
    console.log("Here's the password: ", this.state.password);
    loginUser({ variables: { email: this.state.email, password: this.state.password } });
    this.setState((prevState, state) => ({
      email: '',
      password: ''
    }));
  }

  private updateInput = (event: any) => {
    console.log(this.state)
    if(event.target.id === 'email') {
      this.setState({
        email: event.target.value
      });
    }
    if(event.target.id === 'password') {
      this.setState({
        password: event.target.value
      });
    }
  }

  public render() {
    return (
      <div>
        <Mutation mutation={ LOGIN_USER }>
          {(loginUser, { data }: OperationVariables) => (
            <div>
              <form onSubmit={ this.handleSubmit.bind(this, loginUser) }>
                <h1>Login</h1>
                <input type="text" id="email" value={ this.state.email } onChange={ this.updateInput }/>
                <input type="text" id="password" value={ this.state.password } onChange={ this.updateInput }/>
                <button type="submit">Submit</button>
                { data ? console.log(data) : null }
              </form>
            </div>
          )}
        </Mutation>
      </div>
    )
  }
}

export default Login;