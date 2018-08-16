import { gql } from "apollo-server-express";

export const userTypeDef = gql`
  type User {
    id: Int!
    email: String!
    password: String!
    billing_info: BillingInfo
    cart: Cart
  }
`;
// user_reviews: [UserReview]
