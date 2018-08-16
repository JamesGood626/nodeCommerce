import * as React from "react";
import { Mutation } from "react-apollo";
import { CREATE_USER } from "../../GraphQL/remoteMutations";
import "../../App.css";

/* tslint:disable:no-console */

class Register extends React.Component {
  public state = {
    email: "",
    password: ""
  };
  // Will need to create a separate component for the form so that I may
  // pass createUser function as a prop and bind the handleSubmit function
  // in the form component's constructor. Because binding in render is bad.

  // Coming back to this a month later.. Perfect use for compound components?
  public render() {
    return (
      <div>
        <Mutation mutation={CREATE_USER}>
          {(createUser, { data }) => (
            <div>
              <form onSubmit={this.handleSubmit.bind(this, createUser)}>
                <h1>Register</h1>
                <input
                  type="text"
                  id="email"
                  value={this.state.email}
                  onChange={this.updateStateFields}
                />
                <input
                  type="text"
                  id="password"
                  value={this.state.password}
                  onChange={this.updateStateFields}
                />
                <button type="submit">Submit</button>
                {data ? console.log("Here's the data: ", data) : null}
              </form>
            </div>
          )}
        </Mutation>
      </div>
    );
  }

  // Should create an interface for the variables: email, password which is passed into createUser
  private handleSubmit = (
    createUser: (variables: object) => void,
    e: any
  ): void => {
    e.preventDefault();
    console.log("Here's the target: ", e.target);
    createUser({
      variables: { email: this.state.email, password: this.state.password }
    });
    this.setState((prevState, state) => ({
      email: "",
      password: ""
    }));
  };

  private updateStateFields = (event: any): void => {
    if (event.target.id === "email") {
      this.setState({
        email: event.target.value
      });
    }
    if (event.target.id === "password") {
      this.setState({
        password: event.target.value
      });
    }
    console.log(this.state);
  };
}

export default Register;

// onSubmit={(e: any) => {
//                   e.preventDefault();
//                   console.log(e.target)
//                   createUser({ variables: { email: this.state.email, password: this.state.password } })
//                   this.setState((prevState, state) => ({
//                     email: '',
//                     password: ''
//                   }))
//                 }}
