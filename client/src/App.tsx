import * as React from "react";
import { ApolloClient } from "apollo-client";
import * as ApolloLink from "apollo-link";
import { ApolloCache } from "apollo-cache";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { withClientState } from "apollo-link-state";
import { ApolloProvider } from "react-apollo";
import { gql } from "apollo-boost";
import Main from "./Main";
import "./index.css";
import "./App.css";

interface ILocalState {
  registrationFormValues: IRegistrationFormValues;
  loginCredentials: ILoginCredentials;
}

interface IRegistrationInput {
  registrationInput: {
    email: string;
    password: string;
  };
}

interface ICacheContext {
  cache: ApolloCache<NormalizedCacheObject>;
}

interface IRegistrationFormValues {
  __typename: string;
  email: string;
  password: string;
}

interface ILoginCredentials {
  __typename: string;
  email: string;
  password: string;
}

const cache = new InMemoryCache();
const nodeCommerceGraphQLAPI = new HttpLink({
  uri: "http://localhost:3000/graphql"
});

const defaultState = {
  registrationFormValues: {
    __typename: "RegistrationFormValues",
    email: "",
    password: ""
  },
  loginCredentials: {
    __typename: "LoginCredentials",
    email: "",
    password: ""
  }
};

const stateLink = withClientState({
  cache,
  defaults: defaultState,
  resolvers: {
    Mutation: {
      updateRegistrationFormValues: (
        _: any,
        { registrationInput: { email, password } }: IRegistrationInput,
        { cache }: ICacheContext
      ) => {
        const query = gql`
          query GetRegistrationFormValues {
            registrationFormValues @client {
              __typename
              email
              password
            }
          }
        `;
        const previousState: ILocalState | null = cache.readQuery({
          query
        });
        let data;
        if (previousState !== null) {
          data = {
            ...previousState,
            registrationFormValues: {
              ...previousState.registrationFormValues,
              [email]: email,
              [password]: password
            }
          };
        }
        cache.writeData({ id: query, data });
      }
    }
  }
});

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([stateLink, nodeCommerceGraphQLAPI])
});

class App extends React.Component {
  public render() {
    return (
      <ApolloProvider client={client}>
        <Main />
      </ApolloProvider>
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
