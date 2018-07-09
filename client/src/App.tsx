import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
// import { Query } from 'react-apollo'
// import gql from "graphql-tag"

// import home from './AppPages/home';
// import Login from './AppPages/Login';
// import Register from './AppPages/Register';
import Admin from "./Admin";
import Main from "./Admin";
import "./App.css";

class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact={true} path="/admin" component={Admin} />
          <Route path="/*" component={Main} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;

// {/* <Query
//         query={gql`
//           {
//             hello
//           }
//         `}
//       >
//         {({ loading, error, data }) => {
//           if (loading) return <p>Loading...</p>;
//           if (error) return <p>Error :</p>;

//           return `Hello ${ data.hello }`
//         }}
//       </Query> */}

// state = {
//     username: '',
//     email: '',
//     password: ''
//   }

//   handleSubmit = e => {
//     console.log(this.state)
//     e.preventDefault()
//     axios.post('http://localhost:3000/register', this.state)
//   }

//   handleChange = e => {
//     const key = e.target.name
//     const updatedInput = e.target.value
//     if (key === 'username') {
//       this.setState((prevState, state) => ({
//         username: updatedInput
//       }))
//     }
//     if (key === 'email') {
//       this.setState((prevState, state) => ({
//         email: updatedInput
//       }))
//     }
//     if (key === 'password') {
//       this.setState((prevState, state) => ({
//         password: updatedInput
//       }))
//     }

//   }

//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <h1 className="App-title">Welcome to React</h1>
//         </header>
//         <p className="App-intro">
//           To get started, edit <code>src/App.js</code> and save to reload.
//         </p>
//         <form onSubmit={ this.handleSubmit }>
//           <label>
//             Username:
//             <input type="text" value={this.state.value} onChange={ this.handleChange } name="username"/>
//           </label>
//           <label>
//             Email:
//             <input type="text" onChange={ this.handleChange } name="email"/>
//           </label>
//           <label>
//             Password:
//             <input type="text" onChange={ this.handleChange } name="password"/>
//           </label>
//           <button type="submit">Submit</button>
//         </form>
//       </div>
//     )
//   }
