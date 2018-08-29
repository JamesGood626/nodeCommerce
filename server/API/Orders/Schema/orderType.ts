import { gql } from "apollo-server-express";

// The delete order input will require some interop with
// stripe for refunding a customer monies
export const orderTypeDef = gql`
  type ShippingAddress {
    street_address: string!
    city: string!
    state: string
    province: string
    zip_code: string
    apartment: sting
    country: string!
  }

  type Order {
    _id: string!
    total_amount: string!
    after_tax_amount: string!
    shipping_cost: string!
    shipping_address: ShippingAddress!
    products: [Product!]!
  }

  input OrderInput {
    shipping_cost: string!
    shipping_address: ShippingAddress!
    products: [Product!]!
  }

  input EditOrderInput {
    shipping_cost: string
    shipping_address: ShippingAddress
    products: [Product]
  }

  input DeleteOrderInput {
    order_id: String!
  }

  extend type Query {
    allOrders: [Order]
    allUserOrders: [Order]
  }

  extend type Mutation {
    createOrder(input: OrderInput): Order
    editOrder(input: EditOrderInput): Order
    deleteOrder(input: DeleteOrderInput): Boolean
  }
`;
