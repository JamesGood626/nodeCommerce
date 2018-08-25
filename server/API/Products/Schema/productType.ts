import { gql } from "apollo-server-express";

// graphql requires decimals to be represented as Floats
// was attempting to use Int
export const productTypeDef = gql`
  type Product {
    product_title: String!
    description: String!
    price: Float!
    sale_price: Float
    sale_price_start: Date
    shipping_time: String
    images: [String!]!
  }

  input ProductInput {
    product_title: String!
    description: String!
    price: Float!
    sale_price: Float
    sale_price_start: Date
    shipping_time: String
    images: [String!]!
  }

  extend type Query {
    allProducts: [Product]
  }

  extend type Mutation {
    createProduct(input: ProductInput): Product
  }
`;

// sale_price_expiry: Date
// user_reviews: [UserReview]
