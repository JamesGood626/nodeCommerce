// import { makeExecutableSchema } from "graphql-tools";
// import CartTypeDef from "./cartType";
// import UserTypeDef from "../../Accounts/Schema/userType";
// import BillingInfoTypeDef from "../../BillingInfo/Schema/billingInfoType";
// import ProductTypeDef from "../../Products/Schema/productType";
// import resolvers from "./resolvers";

// const RootQuery = `
//   input CartInput {
//     id: Int!
//     total_price_amount: Int!
//     products: [Product!]!
//     discount: Int
//     total_price_with_discount: Int
//   }

//   type Query {
//     allCarts: [Cart]
//   }

//   type Mutation {
//     createCart(input: CartInput): User
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
//     BillingInfoTypeDef,
//     ProductTypeDef,
//     CartTypeDef
//   ],
//   resolvers
// });

// // extend type Mutation {
// //   loginUser(email: String!, password: String!): User
// // }
// // extend type Mutation {
// //   updatePassword(email: String!, oldPassword: String!, newPassword: String!): User
// // }
