import { gql } from "apollo-server-express";

export const userTypeDef = gql`
  type User {
    id: Int!
    email: String!
    password: String!
    billing_info: BillingInfo
    cart: Cart
  }

  extend type Query {
    allUsers: [User]
  }

  extend type Mutation {
    createUser(email: String!, password: String!): User
    loginUser(email: String!, password: String!): User
    updatePassword(
      email: String!
      oldPassword: String!
      newPassword: String!
    ): User
  }
`;
// user_reviews: [UserReview]
