import { gql } from "apollo-server-express";

export const productTypeDef = gql`
  type Product {
    _id: String!
    product_title: String!
    description: String!
    price: Float!
    sale_price: Float
    sale_price_start: Date
    sale_price_expiry: Date
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
    sale_price_expiry: Date
    images: [String!]!
  }

  input EditProductInput {
    product_id: String!
    product_title: String
    description: String
    price: Float
    sale_price: Float
    sale_price_start: Date
    shipping_time: String
    sale_price_expiry: Date
    images: [String]
  }

  extend type Query {
    allProducts: [Product]
  }

  extend type Mutation {
    createProduct(input: ProductInput): Product
    editProduct(input: EditProductInput): Product
  }
`;

// user_reviews: [UserReview]
