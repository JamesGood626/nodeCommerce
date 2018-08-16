// import { makeExecutableSchema } from "graphql-tools";
// import UserTypeDef from "../../Accounts/Schema/userType";
// import BillingInfoTypeDef from "./billingInfoType";
// import CartTypeDef from "../../Cart/Schema/cartType";
// import ProductTypeDef from "../../Products/Schema/productType";
// import resolvers from "./resolvers";

// const RootQuery = `
//   input BillingInfoInput {
//     street_address: String!
//     apartment: String
//     city: String!
//     state: String
//     zip: String
//     country: String!
//   }

//   type Query {
//     allBillingInfo: [BillingInfo]
//   }

//   type Mutation {
//     createBillingInfo(input: BillingInfoInput): BillingInfo
//   }

//   extend type Mutation {
//     editBillingInfo(input: BillingInfoInput): BillingInfo
//   }

//   extend type Mutation {
//     deleteBillingInfo(input: Boolean): User
//   }
// `;

// const SchemaDefinition = `
//   schema {
//     query: Query
//     mutation: Mutation
//   }
// `;

// export default makeExecutableSchema({
//   typeDefs: [
//     SchemaDefinition,
//     RootQuery,
//     UserTypeDef,
//     ProductTypeDef,
//     CartTypeDef,
//     BillingInfoTypeDef
//   ],
//   resolvers
// });

// extend type Mutation {
//   editBillingInfo(street_address: String!): boolean
// }

// extend type Mutation {
//   deleteBillingInfo(street_address: String!): boolean
// }
