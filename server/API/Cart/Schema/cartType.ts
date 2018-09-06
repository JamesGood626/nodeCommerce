import { gql } from "apollo-server-express";

export const cartTypeDef = gql`
  type Cart {
    _id: String!
    total_price_amount: Float!
    products: [Product!]!
    quantity: Raw!
  }

  input CartInput {
    product_id: String!
    price: Float!
    quantity: Int!
    sale_price: Float
  }

  input RemoveProductInput {
    product_id: String!
    price: Float!
  }

  extend type Query {
    allCarts: [Cart]
  }

  extend type Mutation {
    createCart(input: CartInput): User
    editCart(input: CartInput): User
    removeProduct(input: RemoveProductInput): User
  }
`;

// discount: Int
// total_price_with_discount: Int
