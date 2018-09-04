import { gql } from "apollo-server-express";

export const billingInfoTypeDef = gql`
  type BillingInfo {
    street_address: String!
    city: String!
    state: String!
    zip_code: String!
    apartment: String
    country: String!
  }

  input BillingInfoInput {
    street_address: String!
    city: String!
    state: String!
    zip_code: String!
    apartment: String
    country: String!
  }

  extend type Query {
    allBillingInfo: [BillingInfo]
  }

  extend type Mutation {
    createBillingInfo(input: BillingInfoInput): BillingInfo
    editBillingInfo(input: BillingInfoInput): BillingInfo
    deleteBillingInfo: User
  }
`;
