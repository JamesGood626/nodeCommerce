// import * as axios from 'axios';
// import * as graphql from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import UserReviewTypeDef from './UserReviewType';
import resolvers from './resolvers';

const customDateScalarType = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),
};

const RootQuery = `
  type Query {
    allUserReviews: [UserReview]
  }

  type Mutation {
    createUserReview(rating: Int!, comment: String!): UserReview
  }

  extend type Mutation {
    updateUserReview(reviewId: Int!, rating: Int, comment: String): UserReview
  }

  extend type Mutation {
    deleteUserReview(reviewId: Int!): Boolean
  }
`;

const SchemaDefinition = `
  scalar Date
  schema {
    query: Query
    mutation: Mutation
  }
`;

export default makeExecutableSchema({
  typeDefs: [SchemaDefinition, RootQuery, ...UserReviewTypeDef],
  resolvers: customDateScalarType
});
