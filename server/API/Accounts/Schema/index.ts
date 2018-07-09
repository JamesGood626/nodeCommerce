import { makeExecutableSchema } from 'graphql-tools';
import UserTypeDef from './userType';
import resolvers from './resolvers';

const RootQuery = `
  type Query {
    allUsers: [User]
  }

  type Mutation {
    createUser(email: String!, password: String!): User
  }

  extend type Mutation {
    loginUser(email: String!, password: String!): User
  }

  extend type Mutation {
    updatePassword(email: String!, oldPassword: String!, newPassword: String!): User
  }
`;

const SchemaDefinition = `
  schema {
    query: Query
    mutation: Mutation
  }
`;

export default makeExecutableSchema({
  typeDefs: [ SchemaDefinition, RootQuery, UserTypeDef ],
  resolvers
});
