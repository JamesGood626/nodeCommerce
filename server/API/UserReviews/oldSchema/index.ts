// import * as axios from 'axios';
// import * as graphql from 'graphql';
import { makeExecutableSchema } from "graphql-tools";
import UserReviewTypeDef from "./UserReviewType";
import UserTypeDef from "../../Accounts/Schema/userType";
import ProductTypeDef from "../../Products/Schema/productType";
import resolvers from "./resolvers";

const RootQuery = `
  // on the client side you can autofill these values from
  // previous review if not changed when the user edits.
  input UserReviewInput {
    rating: Int!
    comment: String!
    product_reviewed: String!
  }

  type Query {
    allUserReviews: [UserReview]
  }

  type Mutation {
    createUserReview(input: UserReviewInput!): UserReview
  }
`;

const SchemaDefinition = `
  schema {
    query: Query
    mutation: Mutation
  }
`;

export default makeExecutableSchema({
  typeDefs: [
    SchemaDefinition,
    RootQuery,
    UserTypeDef,
    ProductTypeDef,
    UserReviewTypeDef
  ],
  resolvers
});

// extend type Mutation {
//   updateUserReview(reviewId: Int!, rating: Int, comment: String): UserReview
// }

// extend type Mutation {
//   deleteUserReview(reviewId: Int!): Boolean
// }
