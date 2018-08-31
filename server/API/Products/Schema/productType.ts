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
    user_reviews: [UserReview]
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
    user_reviews: [String]
  }

  input DeleteProductInput {
    product_id: String!
  }

  extend type Query {
    allProducts: [Product]
  }

  extend type Mutation {
    createProduct(input: ProductInput): Product
    editProduct(input: EditProductInput): Product
    deleteProduct(input: DeleteProductInput): Boolean
  }
`;
