import { gql } from "apollo-server-express";

export const billingInfoTypeDef = gql`
  type BillingInfo {
    street_address: String!
    apartment: String
    city: String!
    state: String
    zip: String
    country: String!
  }
`;
