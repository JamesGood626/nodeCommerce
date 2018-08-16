// import { makeExecutableSchema } from "graphql-tools";
// import ProductTypeDef from "./productType";
// import UserReviewTypeDef from "../../UserReviews/Schema/userReviewType";
// import resolvers from "./resolvers";

// const RootQuery = `
//   scalar Date
//   type Date {
//     date: Date
//   }
//   input ProductInput {
//     product_title: String!
//     description: String!
//     price: Int!
//     sale_price: Int
//     sale_price_start: Date
//     sale_price_expiry: Date
//     shipping_time: String
//     images: [String!]!
//   }

//   type Query {
//     allProducts: [Product]
//   }

//   type Mutation {
//     createProduct(input: ProductInput): Product
//   }
// `;

// const SchemaDefinition = `
//   schema {
//     query: Query
//     mutation: Mutation
//   }
// `;
// // UserReviewTypeDef,
// export default makeExecutableSchema({
//   typeDefs: [SchemaDefinition, RootQuery, ProductTypeDef],
//   resolvers
// });

// // extend type Mutation {
// //   loginUser(email: String!, password: String!): User
// // }
// // extend type Mutation {
// //   updatePassword(email: String!, oldPassword: String!, newPassword: String!): User
// // }
