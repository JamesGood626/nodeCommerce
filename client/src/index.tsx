import * as React from "react";
import * as ReactDOM from "react-dom";
import { ApolloClient } from "apollo-client";
import * as ApolloLink from "apollo-link";
// { Cache, DataProxy, ApolloCache, Transaction }
import { ApolloCache } from "apollo-cache";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { withClientState } from "apollo-link-state";
import { ApolloProvider } from "react-apollo";
import { gql } from "apollo-boost";
import App from "./App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

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
        // Wouldn't accept query.
        // and the signature for write data is this:
        // public writeData<TData = any>({
        //   id,
        //   data,
        // }: Cache.WriteDataOptions<TData>): void
        const id = query;
        cache.writeData({ id, data });
      }
    }
  }
});

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([stateLink, nodeCommerceGraphQLAPI])
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
