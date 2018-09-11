import { gql } from "apollo-server-express";

export const userTypeDef = gql`
  type User {
    _id: String!
    email: String!
    password: String!
    billing_info: BillingInfo
    cart: Cart
    orders: [Order]
    user_reviews: UserReview
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
