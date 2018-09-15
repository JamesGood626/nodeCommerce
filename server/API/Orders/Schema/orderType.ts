import { gql } from "apollo-server-express";

// The delete order input will require some interop with
// stripe for refunding a customer monies
// Note: must use inputs as types declarations for nested
// properties of an input. i.e. shipping_address errors out if you
// provide it with the type Address, but will accept an AddressInput without
// error.
export const orderTypeDef = gql`
  type Address {
    street_address: String!
    city: String!
    state: String!
    zip_code: String!
    apartment: String
    country: String!
  }

  type Order {
    _id: String!
    user_email: String!
    total_amount: String!
    after_tax_amount: String!
    shipping_cost: String!
    shipping_address: Address!
    products: [Product!]!
    quantity: Raw!
  }

  input AddressInput {
    street_address: String!
    city: String!
    state: String!
    zip_code: String!
    apartment: String
    country: String!
  }

  input AddressEditInput {
    street_address: String
    city: String
    state: String
    zip_code: String
    apartment: String
    country: String
  }

  input UsersOrdersSearchInput {
    user_email: String!
  }

  input OrderWithShippingAddressInput {
    shipping_address: AddressInput!
  }

  input EditOrderInput {
    order_id: String!
    shipping_address: AddressEditInput
    products: [String]
    quantity: Raw
  }

  input DeleteOrderInput {
    order_id: String!
  }

  extend type Query {
    allOrders: [Order]
    allUserOrders: [Order]
    adminGetAllUserOrders(input: UsersOrdersSearchInput): [Order]
  }

  extend type Mutation {
    createOrderWithUsersBillingInfo: Order
    createOrderWithShippingAddress(input: AddressInput): Order
    editOrder(input: EditOrderInput): Order
    deleteOrder(input: DeleteOrderInput): Boolean
  }
`;
