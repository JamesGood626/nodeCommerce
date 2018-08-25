import { gql } from "apollo-server-express";

export const cartTypeDef = gql`
  type Cart {
    total_price_amount: Int!
    products: [Product!]!
    discount: Int
    total_price_with_discount: Int
  }

  input CartInput {
    id: Int!
    total_price_amount: Int!
    products: [ProductInput!]!
    discount: Int
    total_price_with_discount: Int
  }

  extend type Query {
    allCarts: [Cart]
  }

  extend type Mutation {
    createCart(input: CartInput): User
  }
`;
