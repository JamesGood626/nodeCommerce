import { gql } from "apollo-server-express";

export const userReviewTypeDef = `
  scalar Date
  type UserReview {
    id: String!
    reviewer: User!
    rating: Int!
    comment: String!
    date: Date
    edited: Date
    product_reviewed: Product!
  }
`;
