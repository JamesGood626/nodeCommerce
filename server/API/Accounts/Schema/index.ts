// import * as axios from 'axios';
// import * as graphql from 'graphql';
// import { UserType } from './userType';
import { makeExecutableSchema } from 'graphql-tools';

// const {
//   GraphQLObjectType,
//   GraphQLString,
//   GraphQLInt,
//   GraphQLSchema,
//   GraphQLList,
//   GraphQLNonNull
// } = graphql







// const mutation = new GraphQLObjectType({
//   name: 'Mutation',
//   fields: {
//     createUser: {
//       type: UserType,
//       args: {
//         email: { type: new GraphQLNonNull(GraphQLString) },
//         password: { type: new GraphQLNonNull(GraphQLString) }
//       },
//       resolve(parentValue, { email, password }) {
//         return createUser(email, password);
//       }
//     },
//     loginUser: {
//       type: UserType,
//       args: {
//         email: { type: new GraphQLNonNull(GraphQLString) },
//         password: { type: new GraphQLNonNull(GraphQLString) }
//       },
//       resolve(parentValue, { email, password }, req) {
//         return login({ email, password, req });
//       }
//     },
//     logoutUser: {
//       type: UserType,
//       args: {
//         email: { type: new GraphQLNonNull(GraphQLString) }
//       },
//       resolve(parentValue, { email }, req) {
//         const { user } = req;
//         req.logout();
//         return user;
//       }
//     },
//     updatePassword: {
//       type: UserType,
//       args: {
//         email: { type: new GraphQLNonNull(GraphQLString) },
//         oldPassword: { type: new GraphQLNonNull(GraphQLString) },
//         newPassword: { type: new GraphQLNonNull(GraphQLString) }
//       },
//       resolve(parentValue, { email, oldPassword, newPassword }) {
//         return updatePassword({ email, oldPassword, newPassword });
//       }
//     }
//   }
// });






// const RootQuery = new GraphQLObjectType({
//   name: 'RootQueryType',
//   fields: {
//     hello: {
//       type: GraphQLString,
//       resolve() {
//         return 'world';
//       }
//     }
//   }
// });

// export const userSchema = new GraphQLSchema({
//   query: RootQuery,
//   mutation
// });



// schema.js
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

// If You need to extend Query or Mutation in the RootQuery func
// const typeDefs = [`
//   schema {
//     query: Query
//   }
//
//   type Query {
//     bars: [Bar]!
//   }
//
//   type Bar {
//     id
//   }
//   `, `
//   type Foo {
//     id: String!
//   }
//
//   extend type Query {
//     foos: [Foo]!
//   }
// `]
