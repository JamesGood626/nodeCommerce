import { gql } from "apollo-server-express";

export const productTypeDef = gql`
  type Product {
    product_title: String!
    description: String!
    price: Int!
    sale_price: Int
    sale_price_start: Date
    sale_price_expiry: Date
    shipping_time: String
    images: [String!]!
  }
`;

// user_reviews: [UserReview]
